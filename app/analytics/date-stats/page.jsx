"use client"
import React, { useEffect, useState } from 'react'

const DateSats = () => {
  const [promptPerDate, setPromptPerDate] = useState([]);

  const fetchDateAnalytics = async () => {

    const response = await fetch(`/api/prompt/date-stats`);
    const result = await response.json();

    setPromptPerDate(result.promptPerDate);
  };

  
  useEffect(() => {
    fetchDateAnalytics();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">📊 Analytics of Date of Creation of Prompts</h1>
      <div className="p-4 bg-white rounded-xl shadow space-y-2">
        <h2 className="text-xl font-semibold">Prompt Count per Date</h2>
        <ul className="list-disc pl-5 space-y-1">
          {promptPerDate.map((item, index) => (
            <li key={index} className="text-base">
              <span className="font-medium">{item._id}:</span> {item.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DateSats