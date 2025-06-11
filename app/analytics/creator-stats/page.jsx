"use client"
import React, { useEffect, useState } from 'react'

const CreatorStats = () => {
  const [creatorStats, setCreatorStats] = useState([]);

  const fetchCreatorAnalytics = async () => {

    const response = await fetch(`/api/prompt/creator-stats`);
    const result = await response.json();

    // console.log(result.creatorStats);
    setCreatorStats(result.creatorStats);
  };

  
  useEffect(() => {
    fetchCreatorAnalytics();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">📊 Creator Analytics</h1>

      <div className="p-4 bg-white rounded-xl shadow space-y-2">
        <h2 className="text-xl font-semibold">Top 5 Most active Prompt Creators</h2>
        <ul className="list-disc pl-5 space-y-1">
          {creatorStats.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center text-base bg-gray-50 p-2 rounded-md"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{item.username}</span>
                <span className="text-gray-500 text-sm mt-0.5">&lt;{item.email}&gt;</span>
              </div>
              <span className="font-medium text-blue-600 ml-6">{item.count}</span>
            </li>

          ))}
        </ul>
      </div>
    </div>
  )
}

export default CreatorStats