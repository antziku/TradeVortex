import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosInstance.js"; // 기존 인스턴스를 사용
import { motion } from "framer-motion";

const NewsDetail = () => {
  const { id } = useParams(); // URL 파라미터에서 뉴스 ID 추출
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 뉴스 상세 정보를 가져오는 API 호출
    axios
      .get(`http://localhost:8000/api/news/news/${id}`)
      .then((response) => {
        setNews(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news detail", err);
        setError("뉴스 상세 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-red-500">
        {error}
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        뉴스를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${news.image ? `http://localhost:8000${news.image}` : "/media/default_news_image.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* 뉴스 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white bg-opacity-90 p-6 md:p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
          {news.title}
        </h1>
        <p className="text-sm text-gray-500 mb-2">
          <strong>작성일:</strong> {new Date(news.created_at).toLocaleDateString()}
        </p>

        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed">{news.content}</p>
        </div>

        <p className="text-gray-700">
          <strong>관련 자산:</strong> {news.asset || "정보 없음"}
        </p>

        <div className="mt-6 flex gap-3">
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300"
          >
            🔗 원본 기사 보기
          </a>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md shadow-md transition duration-300"
          >
            ⬅ 돌아가기
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsDetail;
