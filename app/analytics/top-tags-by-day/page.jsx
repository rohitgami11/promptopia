"use client"
import React, { useEffect, useState } from 'react'

const TopActiveDays = () => {
  const [topTagsPerDay, setTopTagsPerDay] = useState([]);

  const fetchAnalytics = async () => {
    const response = await fetch(`/api/prompt/top-tags-per-day`);
    const result = await response.json();
    console.log(result.topTagsPerDay);
    setTopTagsPerDay(result.topTagsPerDay);
  };

  
  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">📊 Tag Analytics for Week Days</h1>

      <div className="p-4 bg-white rounded-xl shadow space-y-2">
        <h2 className="text-xl font-semibold">Top three tags on each day of week</h2>
        <ul className="list-disc pl-5 space-y-1">
          {topTagsPerDay.map((item, index) => (
            <li key={index}>
              <p className="font-medium text-lg">{item.day}:</p>
              <ul className="list-disc pl-6">
                {item.tags.map((tagObject, tagIndex) => (
                  <li key={tagIndex}>
                    {tagObject.tag} ({tagObject.count})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TopActiveDays