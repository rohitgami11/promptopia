"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import toast from "react-hot-toast";

const PromptCardList = ({ data, handleTagClick }) => (
  <div className="mt-10 prompt_layout w-full">
    {data.map((post) => (
      <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
    ))}
  </div>
);

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchPosts = async ({ cursor = null, prevCursor = null, query = "" } = {}) => {
    console.log("Fetching posts with: ", { cursor, prevCursor, query });

    const params = new URLSearchParams({
      limit: 10,
    });
    
    if (cursor) params.append("cursor", cursor);
    if (prevCursor) params.append("prevCursor", prevCursor);
    if (query) params.append("search", query);
    
    console.log("Final API URL:", `/api/prompt?${params}`);
    
    const response = await fetch(`/api/prompt?${params}`);
    const result = await response.json();
    
    if (result.prompts.length === 0) {
      console.log("⚠️ No prompts found for this request. State not updated.");
      toast.error("No more prompts in this direction.");
      return; // don't update anything if empty
    }

    console.log("Fetched prompts:", result.prompts);
    console.log("New nextCursor:", result.nextCursor);
    console.log("New prevCursor:", result.prevCursor);

    setPosts(result.prompts);
    setNextCursor(result.nextCursor);
    setPrevCursor(result.prevCursor);
  };

  // Initial load
  useEffect(() => {
    console.log("Initial page load");
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    const value = e.target.value;
    setSearchText(value);

    setSearchTimeout(
      setTimeout(() => {
        console.log("Triggering search for:", value);
        setNextCursor(null);
        setPrevCursor(null);
        fetchPosts({ query: value });
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    console.log("Tag clicked:", tagName);
    setSearchText(tagName);
    setNextCursor(null);
    setPrevCursor(null);
    fetchPosts({ query: tagName });
  };

  const handleNavigatePrevious = () => {
    console.log("Clicking Prev — prevCursor:", prevCursor);
    if (prevCursor) {
      fetchPosts({ prevCursor: prevCursor, query: searchText });
    }
  };

  const handleNavigateNext = () => {
    console.log("Clicking Next — nextCursor:", nextCursor);
    if (nextCursor) {
      fetchPosts({ cursor: nextCursor, query: searchText });
    }
  };

  return (
    <div>
      <section className="feed">
        <form className="relative w-full flex-center">
          <input
            type="text"
            placeholder="Search for a tag or a username"
            value={searchText}
            onChange={handleSearchChange}
            className="search_input peer"
          />
        </form>
        <nav aria-label="Page navigation" className="flex justify-center gap-5 mt-5">
          <button
            onClick={handleNavigatePrevious}
            disabled={!prevCursor}
            className="px-5 py-2 text-lg bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
          >
            ⬅ Prev
          </button>

          <button
            onClick={handleNavigateNext}
            disabled={!nextCursor}
            className="px-5 py-2 text-lg bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
          >
            Next ➡
          </button>
        </nav>
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      </section>
    </div>
  );
};

export default Feed;
