"use client"
import React, { useEffect, useState } from 'react'

const Analytics = () => {
  const [totalPromptCount, setTotalPromptCount] = useState(0);
  const [promptPerTag, setPromptPerTag] = useState([]);
  const [mostCommonPrompt, setMostCommonPrompt] = useState('Loading ...');

  const fetchAnalytics = async () => {

    const response = await fetch(`/api/prompt/analytics`);
    const result = await response.json();

    setTotalPromptCount(result.totalPromptCount);
    setPromptPerTag(result.promptPerTag);
    setMostCommonPrompt(result.mostCommonPrompt[0]?.prompt || 'No prompts yet');
  };

  
  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">📊 Prompt Analytics</h1>

      <div className="p-4 bg-white rounded-xl shadow space-y-2">
        <h2 className="text-xl font-semibold">Total Prompts</h2>
        <p className="text-2xl">{totalPromptCount}</p>
      </div>

      <div className="p-4 bg-white rounded-xl shadow space-y-2">
        <h2 className="text-xl font-semibold">Most Common Prompt</h2>
        <p className="text-lg">{mostCommonPrompt}</p>
      </div>

      <div className="p-4 bg-white rounded-xl shadow space-y-2">
        <h2 className="text-xl font-semibold">Prompt Count per Tag</h2>
        <ul className="list-disc pl-5 space-y-1">
          {promptPerTag.map((item, index) => (
            <li key={index} className="text-base">
              <span className="font-medium">{item._id}:</span> {item.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Analytics