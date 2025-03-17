"use client";
import React from "react";

function MainComponent() {
  const [posts, setPosts] = useState([]);
  const [categories] = useState([
    { id: 1, name: "Strategy", icon: "fa-chess" },
    { id: 2, name: "Marketing", icon: "fa-bullhorn" },
    { id: 3, name: "Finance", icon: "fa-chart-line" },
    { id: 4, name: "Operations", icon: "fa-cogs" },
    { id: 5, name: "Leadership", icon: "fa-users" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts");
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts
    .filter(
      (post) =>
        (!selectedCategory || post.categoryId === selectedCategory) &&
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date) - new Date(a.date);
      }
      return b.likes - a.likes;
    });
  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!title || !content || !selectedCategoryId) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          categoryId: selectedCategoryId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create thread");
      }

      setShowNewThreadModal(false);
      setTitle("");
      setContent("");
      setSelectedCategoryId(null);

      const updatedResponse = await fetch("/api/posts");
      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated posts");
      }
      const updatedPosts = await updatedResponse.json();
      setPosts(updatedPosts);
    } catch (err) {
      console.error(err);
      setError("Failed to create thread");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <a
                href="/"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                <i className="fas fa-home mr-2"></i>
                Home
              </a>
              <a
                href="/forum"
                className="flex items-center px-3 py-2 text-blue-600"
              >
                <i className="fas fa-comments mr-2"></i>
                Forum
              </a>
              <a
                href="/evaluation"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                <i className="fas fa-chart-line mr-2"></i>
                Evaluation
              </a>
            </div>
            <div className="flex items-center">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-roboto text-gray-800 mb-4 md:mb-0">
              Business Discussion Forum
            </h1>
            <button
              onClick={() => setShowNewThreadModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>New Thread
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-roboto text-xl font-semibold mb-4">
                  Categories
                </h2>
                <ul>
                  {categories.map((category) => (
                    <li key={category.id} className="mb-2">
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? "bg-blue-100 text-blue-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <i className={`fas ${category.icon} mr-2`}></i>
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center mb-2">
                      <img
                        src={post.authorAvatar}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <h3 className="font-roboto font-semibold">
                          {post.authorName}
                        </h3>
                        <span className="text-sm text-gray-500">
                          Reputation: {post.authorReputation}
                        </span>
                      </div>
                    </div>
                    <h2 className="font-roboto text-xl font-semibold mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{post.content}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">
                        <i className="fas fa-heart mr-1"></i>
                        {post.likes}
                      </span>
                      <span className="mr-4">
                        <i className="fas fa-comment mr-1"></i>
                        {post.comments}
                      </span>
                      <span>
                        <i className="fas fa-clock mr-1"></i>
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showNewThreadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-roboto font-semibold">
                  Create New Thread
                </h2>
                <button
                  onClick={() => setShowNewThreadModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleCreateThread}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Thread Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <select
                    value={selectedCategoryId || ""}
                    onChange={(e) =>
                      setSelectedCategoryId(Number(e.target.value))
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <textarea
                    placeholder="Thread Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="6"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Thread
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;