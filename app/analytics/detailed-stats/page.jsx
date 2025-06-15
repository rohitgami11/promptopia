"use client"
import React, { useEffect, useState } from 'react'

const TopTag = () => {
  const [detailedStats, setDetailedStats] = useState([]);

  const fetchAnalytics = async () => {

    const response = await fetch(`/api/prompt/detailed-stats`);
    const result = await response.json();

    setDetailedStats(result.detailedStats);
  };
  
  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">📊 Details Analytics</h1>

      <div className="p-4 bg-white rounded-xl shadow space-y-2">
        <h2 className="text-xl font-semibold">Stats of users activity</h2>
        <ul className="list-disc pl-5 space-y-1">
          {detailedStats.map((item, index) => (
            <li key={index}>
              <p><strong>Creator:</strong> {item.creatorEmail}</p>
              <p><strong>Total Prompts:</strong> {item.totalPrompts}</p>
              <p><strong>Unique Tags:</strong> {item.uniqueTags.join(", ")}</p>
              <p><strong>Latest Prompt:</strong> {new Date(item.latestPromptDate).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TopTag