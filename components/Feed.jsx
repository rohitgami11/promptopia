"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => (
  <div className='mt-10 prompt_layout w-full'>
    {data.map((post) => (
      <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
    ))}
  </div>
);

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchPosts = async (query = "", pageNum = 1) => {
    const params = new URLSearchParams({
      page: pageNum,
      limit: 10,
    });

    if (query) params.append("search", query);

    const response = await fetch(`/api/prompt?${params}`);
    const result = await response.json();

    setPosts(result.prompts);
    setTotalPages(result.totalPages);
  };

  useEffect(() => {
    fetchPosts(searchText, page);
  }, [page]);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    const value = e.target.value;
    setSearchText(value);

    setSearchTimeout(
      setTimeout(() => {
        setPage(1); // Reset to first page on new search
        fetchPosts(value, 1);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    setPage(1);
    fetchPosts(tagName, 1);
  };

  const handleNavigatePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNavigateNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div>
      <section className='feed'>
        <form className='relative w-full flex-center'>
          <input
            type='text'
            placeholder='Search for a tag or a username'
            value={searchText}
            onChange={handleSearchChange}
            className='search_input peer'
          />
        </form>

        <PromptCardList data={posts} handleTagClick={handleTagClick} />

        <nav aria-label="Page navigation" className="flex justify-center gap-3 mt-5">
          <button
            onClick={handleNavigatePrevious}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 bg-gray-200 rounded">{page}</span>
          <button
            onClick={handleNavigateNext}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </section>
    </div>
  );
};

export default Feed;
