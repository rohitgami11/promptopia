"use client"
import React, { useEffect, useState } from 'react'

const TopActiveDays = () => {
  const [topActiveDays, setTopActiveDays] = useState([]);

  const fetchAnalytics = async () => {
    const response = await fetch(`/api/prompt/top-active-days`);
    const result = await response.json();
    console.log(result.topActiveDays);
    setTopActiveDays(result.topActiveDays);
  };

  
  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">📊 Week Days Analytics</h1>

      <div className="p-4 bg-white rounded-xl shadow space-y-2">
        <h2 className="text-xl font-semibold">Week days Prompt Creation counts</h2>
        <ul className="list-disc pl-5 space-y-1">
          {topActiveDays.map((item, index) => (
            <li key={index} className="text-base">
              <span className="font-medium">{item.day}:</span> {item.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TopActiveDays