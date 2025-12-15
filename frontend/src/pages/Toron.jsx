import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../redux/slices/themeSlice";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

const Toron = () => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    const [categories, setCategories] = useState([]);
    const [votes, setVotes] = useState({});

    useEffect(() => {
        axios.get("http://localhost:8000/api/toron/categories/")
            .then((response) => {
                setCategories(response.data);
                fetchVoteSummary();
            })
            .catch((error) => console.error("카테고리 API 호출 오류:", error));
    }, []);

    const fetchVoteSummary = () => {
        axios.get("http://localhost:8000/api/toron/votes/summary/")
            .then((response) => {
                const voteData = response.data.reduce((acc, item) => {
                    acc[item.category_name] = {
                        up: item.up,
                        down: item.down,
                        messages: item.opinions.map((opinion) => ({
                            text: opinion.text,
                            type: opinion.type,
                        })),
                    };
                    return acc;
                }, {});
                setVotes(voteData);
            })
            .catch((error) => console.error("투표 요약 API 호출 오류:", error));
    };

    const handleVote = (category, type) => {
        const opinion = prompt("한마디를 입력해주세요!");
        if (!opinion) return;

        axios.post("http://localhost:8000/api/toron/votes/", {
            category: category.id,
            vote_type: type,
            opinion: opinion
        })
        .then(() => {
            setVotes((prevVotes) => {
                const updatedVotes = { ...prevVotes };
                updatedVotes[category.name] = {
                    ...updatedVotes[category.name],
                    [type]: updatedVotes[category.name][type] + 1,
                    messages: [
                        ...updatedVotes[category.name].messages,
                        { text: opinion, type },
                    ],
                };
                return updatedVotes;
            });
        })
        .catch((error) => console.error("투표 API 호출 오류:", error));
    };

    const getChartOptions = (categoryName, voteData) => ({
        chart: {
            type: "pie",
            width: 250,
            height: 250,
            backgroundColor: isDarkMode ? "#1E293B" : "transparent", // 다크모드 배경 조정
        },
        title: {
            text: categoryName,
            style: { fontSize: "16px", color: isDarkMode ? "#FFF" : "#000" }, // 제목 색상 변경
        },
        tooltip: {
            backgroundColor: isDarkMode ? "#374151" : "#FFF", // 툴팁 배경 조정
            style: { color: isDarkMode ? "#FFF" : "#000" }, // 툴팁 텍스트 색상
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    color: isDarkMode ? "#FFF" : "#000", // 데이터 라벨 색상 변경
                },
            },
        },
        series: [
            {
                name: "투표 비율",
                colorByPoint: true,
                data: [
                    { name: "오른다", y: (voteData?.up / (voteData?.up + voteData?.down || 1)) * 100, color: "#10b981" },
                    { name: "내린다", y: (voteData?.down / (voteData?.up + voteData?.down || 1)) * 100, color: "#ef4444" },
                ],
            },
        ],
    });

    return (
        <div className="flex  ">
            <div className={`flex-grow p-6 mx-auto shadow-lg rounded-lg transition-all duration-300 ${
                isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-screen">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className={`border p-6 rounded-lg shadow flex flex-col min-h-[300px] ${
                                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50"
                            }`}
                        >
                            <div className="flex flex-col items-center">
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={getChartOptions(category.name, votes[category.name])}
                                />
                            </div>
                            <div className="flex justify-center space-x-4 mt-4">
                                <button
                                    onClick={() => handleVote(category, "up")}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 text-lg flex items-center">
                                    ▲ {votes[category.name]?.up || 0}
                                </button>
                                <button
                                    onClick={() => handleVote(category, "down")}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 text-lg flex items-center">
                                    ▼ {votes[category.name]?.down || 0}
                                </button>
                            </div>
                            <div className="border-t pt-4 mt-6 flex-grow">
                                <h3 className="font-semibold text-sm">📢 {category.name} 의견</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {votes[category.name]?.messages.length === 0 ? (
                                        <p className="text-gray-500 text-sm">아직 의견이 없습니다.</p>
                                    ) : (
                                        votes[category.name]?.messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`p-3 rounded-md text-sm border-l-4 ${
                                                    msg.type === 'up' ? 'border-green-600 bg-green-500 text-white' : 'border-red-600 bg-red-500 text-white'
                                                }`}
                                            >
                                                <span className="font-semibold">
                                                    {msg.type === 'up' ? '▲ 오른다' : '▼ 내린다'}
                                                </span>: {msg.text}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Toron;
