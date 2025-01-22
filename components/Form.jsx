import Link from "@node_modules/next/link";

const Form = ({ post, type, setPost, submitting, handleSubmit }) => {
  const handleTagChange = (e) => {
    setPost({ ...post, currentTag: e.target.value });
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = post.currentTag.trim();
      if (newTag && !post.tags.includes(newTag)) {
        setPost({ ...post, tags: [...post.tags, newTag], currentTag: "" });
      }
    }
  };

  const handleTagRemove = (index) => {
    const updatedTags = post.tags.filter((_, i) => i !== index);
    setPost({ ...post, tags: updatedTags });
  };
  
  const handleLinkChange = (e) => {
    setPost({ ...post, link: e.target.value });
    console.log(post.link);
  };

  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post</span>
      </h1>
      <p className="desc text-left max-w-md">
        {type} and share amazing prompts with the world, and let your imagination run wild with any AI-powered platform
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Your AI Prompt
          </span>
          <textarea
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder="Write your post here"
            required
            className="form_textarea"
          />
        </label>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Tags (press enter to add a tag)
          </span>
          <input
            value={post.currentTag || ""}
            onChange={handleTagChange}
            onKeyDown={handleTagKeyDown}
            type="text"
            placeholder="Enter a tag and press Enter"
            className="form_input"
          />
        </label>
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags && post.tags.map((tag, index) => (
            <div
              key={index}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md flex items-center"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleTagRemove(index)}
                className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Link (optional)
          </span>
          <input
            value={post.link || ""}
            onChange={handleLinkChange}
            type="url"
            placeholder="Enter a link (optional)"
            className="form_input"
          />
        </label>

        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-500 text-sm">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
