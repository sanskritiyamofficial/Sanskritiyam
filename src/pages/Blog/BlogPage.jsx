import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogData, getBlogsByCategory, searchBlogs } from '../../data/blogData';
import './BlogPage.css';

const BlogPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredBlogs, setFilteredBlogs] = useState([]);


  // Filter blogs based on search term and category
  useEffect(() => {
    let filtered;

    // First filter by category
    if (activeFilter !== 'all') {
      filtered = getBlogsByCategory(activeFilter);
    } else {
      filtered = blogData;
    }

    // Then filter by search term
    if (searchTerm) {
      filtered = searchBlogs(searchTerm).filter(blog => 
        activeFilter === 'all' || blog.category === activeFilter
      );
    }

    setFilteredBlogs(filtered);
  }, [searchTerm, activeFilter]);

  const handleFilterClick = (category, buttonElement) => {
    setActiveFilter(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBlogClick = (slug) => {
    navigate(`/blogs/${slug}`);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Search Bar */}
      <div className="w-full z-40 sticky top-0 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <input
            type="text"
            id="searchInput"
            placeholder="🔍 Search blogs (e.g. mantra, raksha bandhan...)"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border-2 border-orange-500 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-100'
            }`}
            onClick={() => handleFilterClick('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'mantra'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-100'
            }`}
            onClick={() => handleFilterClick('mantra')}
          >
            🔆 Mantras
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'puja'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-100'
            }`}
            onClick={() => handleFilterClick('puja')}
          >
            🪔 Puja
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'festival'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-100'
            }`}
            onClick={() => handleFilterClick('festival')}
          >
            🎉 Festival
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'temple'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-100'
            }`}
            onClick={() => handleFilterClick('temple')}
          >
            🪔 Temple
          </button>
        </div>
      </div>

      {/* Blog List */}
      <section id="blogList" className="blog-container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="blog-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleBlogClick(blog.slug)}
            >
              <div className="relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="badge bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {blog.badge}
                  </span>
                </div>
              </div>
              
              <div className="blog-content p-6">
                <h2 className="blog-title text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="blog-desc text-gray-600 mb-4 line-clamp-3">
                  {blog.description}
                </p>
                <p className="blog-meta text-sm text-gray-500 mb-4">
                  Author: {blog.author} | {blog.date} | {blog.readTime}
                </p>
                <div className="read-more text-orange-500 font-medium hover:text-orange-600 transition-colors">
                  Read Full →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No blogs found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filter options
            </p>
          </div>
        )}
      </section>

      {/* Bottom Sticky Navigation - Mobile Only */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-orange-100 z-50 md:hidden">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex flex-col items-center transition text-gray-600 hover:text-orange-500"
            >
              <i className="fas fa-home text-md"></i>
              <span className="text-[10px] mt-0.5">Home</span>
            </button>
            <button
              onClick={() => navigate('/pujas')}
              className="flex flex-col items-center text-orange-600 hover:text-orange-500 transition"
            >
              <i className="fas fa-om text-md"></i>
              <span className="text-[10px] mt-0.5">Puja</span>
            </button>
            <button
              onClick={() => navigate('/chadhawa')}
              className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition"
            >
              <i className="fas fa-gift text-md"></i>
              <span className="text-[10px] mt-0.5">Prasad</span>
            </button>
            <button className="flex flex-col items-center text-orange-500 transition">
              <i className="fas fa-blog text-md"></i>
              <span className="text-[10px] mt-0.5">Blogs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Book Puja Button */}
      <button
        onClick={() => navigate('/pujas')}
        className="floating-book-btn fixed bottom-20 right-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 z-40"
      >
        <i className="fas fa-om"></i>
        <span className="hidden sm:inline">Book Puja Now</span>
      </button>
    </div>
  );
};

export default BlogPage;
