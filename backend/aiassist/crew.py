import os
import yaml
import datetime
from typing import Type
from dotenv import load_dotenv
from pydantic import BaseModel, Field
# CrewAI tool base class (import path differs by version)
try:
    from crewai.tools import BaseTool
except Exception:  # pragma: no cover
    from crewai.tools.base_tool import BaseTool
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from duckduckgo_search import DDGS

# .env 파일 로드
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=env_path)

# YAML 파일 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AGENTS_CONFIG_PATH = os.path.join(BASE_DIR, 'config', 'agents.yaml')
TASKS_CONFIG_PATH = os.path.join(BASE_DIR, 'config', 'tasks.yaml')

# 현재 날짜 가져오기
CURRENT_DATE = datetime.datetime.now().strftime("%Y-%m-%d")


# ✅ CrewAI에서 사용 가능한 DuckDuckGo 검색 툴 (BaseTool 구현: args_schema로 query 강제)
class DuckDuckGoSearchArgs(BaseModel):
    query: str = Field(..., description="Search query")
    max_results: int = Field(default=5, ge=1, le=10, description="Number of results to return")


class DuckDuckGoSearchTool(BaseTool):
    name: str = "DuckDuckGo Search"
    description: str = "Search the web using DuckDuckGo and return top results."
    args_schema: Type[BaseModel] = DuckDuckGoSearchArgs

    def _run(self, query: str, max_results: int = 5) -> str:
        if not query or not isinstance(query, str):
            return "⚠️ Error: No valid search query provided."

        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=max_results))

            if not results:
                return "🔍 No relevant results found."

            lines = []
            for i, res in enumerate(results, start=1):
                title = res.get("title", "(no title)")
                href = res.get("href", "")
                body = res.get("body", "") or res.get("snippet", "") or ""
                body = body.replace("\n", " ").strip()
                if len(body) > 220:
                    body = body[:220].rstrip() + "…"

                # Provide a compact evidence-rich line per result
                if body:
                    lines.append(f"[{i}] {title}\n- URL: {href}\n- Snippet: {body}")
                else:
                    lines.append(f"[{i}] {title}\n- URL: {href}")

            return "\n\n".join(lines)

        except Exception as e:
            return f"⚠️ Error: DuckDuckGo search failed - {str(e)}"


# ✅ CrewAI가 인식할 수 있도록 Tool 인스턴스 생성
duckduckgo_tool = DuckDuckGoSearchTool()


@CrewBase
class MyCrew:
    """Crew 정의"""

    def __init__(self):
        if not os.path.exists(AGENTS_CONFIG_PATH):
            raise FileNotFoundError(f"❌ 에이전트 설정 파일이 없습니다: {AGENTS_CONFIG_PATH}")
        if not os.path.exists(TASKS_CONFIG_PATH):
            raise FileNotFoundError(f"❌ 작업 설정 파일이 없습니다: {TASKS_CONFIG_PATH}")

        self.agents_config = self.load_yaml(AGENTS_CONFIG_PATH)
        self.tasks_config = self.load_yaml(TASKS_CONFIG_PATH)

        # YAML에서 {current_date} 변수를 치환
        self.inject_current_date()

        # CrewAI가 인식하는 Tool 적용
        self.duckduckgo_tool = duckduckgo_tool

    def load_yaml(self, path):
        """YAML 파일을 로드하는 함수"""
        with open(path, 'r', encoding='utf-8') as file:
            return yaml.safe_load(file)

    def inject_current_date(self):
        """현재 날짜를 YAML 설정에 자동으로 삽입"""
        for key in self.tasks_config:
            if isinstance(self.tasks_config[key], dict):
                for sub_key in self.tasks_config[key]:
                    if isinstance(self.tasks_config[key][sub_key], str):
                        self.tasks_config[key][sub_key] = self.tasks_config[key][sub_key].replace("{current_date}", CURRENT_DATE)

    def _ollama_llm(self):
        """Explicit Ollama LLM binding for this Crew only.

        Env:
          - OLLAMA_MODEL (default: qwen3:4b-instruct-2507-q4_K_M)
          - OLLAMA_BASE_URL (default: http://host.docker.internal:11434)
          - OLLAMA_TEMPERATURE (default: 0.05)
        """
        from crewai import LLM

        model_name = os.getenv("OLLAMA_MODEL", "qwen3:4b-instruct-2507-q4_K_M")
        model = model_name if model_name.startswith("ollama/") else f"ollama/{model_name}"
        base_url = os.getenv("OLLAMA_BASE_URL", "http://host.docker.internal:11434")
        # Lower temperature reduces hallucinations for research/citation-heavy tasks
        try:
            temperature = float(os.getenv("OLLAMA_TEMPERATURE", "0.05"))
        except ValueError:
            temperature = 0.05

        return LLM(
            model=model,
            base_url=base_url,
            api_base=base_url,
            temperature=temperature,
            stream=False,
            timeout=600,
        )

    # 3) 에이전트 정의
    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config["researcher"],
            tools=[self.duckduckgo_tool],
            llm=self._ollama_llm(),
            verbose=True
        )

    @agent
    def reporting_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config["reporting_analyst"],
            llm=self._ollama_llm(),
            verbose=True
        )

    # 4) 작업(Task) 정의
    @task
    def research_task(self) -> Task:
        """현재 날짜를 명시적으로 포함하여 Task 생성"""
        description = self.tasks_config["research_task"]["description"].replace("{current_date}", CURRENT_DATE)
        expected_output = self.tasks_config["research_task"]["expected_output"].replace("{current_date}", CURRENT_DATE)

        return Task(
            description=description,
            expected_output=expected_output,
            agent=self.researcher()  # ✅ 에이전트 명시
        )

    @task
    def reporting_task(self) -> Task:
        """현재 날짜를 명시적으로 포함하여 Task 생성"""
        description = self.tasks_config["reporting_task"]["description"].replace("{current_date}", CURRENT_DATE)
        expected_output = self.tasks_config["reporting_task"]["expected_output"].replace("{current_date}", CURRENT_DATE)

        return Task(
            description=description,
            expected_output=expected_output,
            output_file='report.md',
            agent=self.reporting_analyst()  # ✅ 에이전트 명시
        )

    # 5) 크루 정의
    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
