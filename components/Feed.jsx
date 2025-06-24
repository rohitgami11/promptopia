"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import toast from "react-hot-toast";

// Child component
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
  const [activeTags, setActiveTags] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchPosts = async ({
    cursor = null,
    prevCursor = null,
    query = "",
    tags = [],
  } = {}) => {
    const params = new URLSearchParams({ limit: 3 });

    if (cursor?.cursorId) {
      params.append("cursorId", cursor.cursorId);
      if (cursor.cursorScore != null) {
        params.append("cursorScore", cursor.cursorScore);
      }
    }

    if (prevCursor?.prevCursorId) {
      params.append("prevCursorId", prevCursor.prevCursorId);
      if (prevCursor.prevCursorScore != null) {
        params.append("prevCursorScore", prevCursor.prevCursorScore);
      }
    }

    if (query) params.append("search", query);
    if (tags.length > 0) params.append("tags", tags.join(","));

    console.log("⏩ Sending request with params:", params.toString());

    const response = await fetch(`/api/prompt?${params}`);
    const result = await response.json();

    if (result.prompts.length === 0) {
      toast.error("No more prompts in this direction.");
      return;
    }

    setPosts(result.prompts);
    setNextCursor(result.nextCursor);
    setPrevCursor(result.prevCursor);
  };

  useEffect(() => {
    fetchPosts({ query: searchText, tags: activeTags });
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    const value = e.target.value;
    setSearchText(value);

    setSearchTimeout(
      setTimeout(() => {
        setNextCursor(null);
        setPrevCursor(null);
        fetchPosts({ query: value, tags: activeTags });
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    if (!activeTags.includes(tagName)) {
      const newTags = [...activeTags, tagName];
      setActiveTags(newTags);
      setNextCursor(null);
      setPrevCursor(null);
      fetchPosts({ query: searchText, tags: newTags });
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = activeTags.filter((tag) => tag !== tagToRemove);
    setActiveTags(newTags);
    setNextCursor(null);
    setPrevCursor(null);
    fetchPosts({ query: searchText, tags: newTags });
  };

  const handleNavigatePrevious = () => {
    if (prevCursor?.prevCursorId) {
      fetchPosts({
        prevCursor: {
          prevCursorId: prevCursor.prevCursorId,
          prevCursorScore: prevCursor.prevCursorScore,
        },
        query: searchText,
        tags: activeTags,
      });
    }
  };

  const handleNavigateNext = () => {
    if (nextCursor?.cursorId) {
      fetchPosts({
        cursor: {
          cursorId: nextCursor.cursorId,
          cursorScore: nextCursor.cursorScore,
        },
        query: searchText,
        tags: activeTags,
      });
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

        {activeTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activeTags.map((tag) => (
              <div
                key={tag}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center"
              >
                <span>#{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label={`Remove ${tag}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <nav className="flex justify-center gap-5 mt-5">
          <button
            onClick={handleNavigatePrevious}
            disabled={!prevCursor?.prevCursorId}
            className="px-5 py-2 text-lg bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
          >
            ⬅ Prev
          </button>
          <button
            onClick={handleNavigateNext}
            disabled={!nextCursor?.cursorId}
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
