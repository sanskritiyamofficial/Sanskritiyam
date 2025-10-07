import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogs, searchBlogs as searchBlogsFirebase } from '../../firebase/blogService';
import './BlogPage.css';

const BlogPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      let result;

      if (searchTerm) {
        // Search blogs
        result = await searchBlogsFirebase(searchTerm, {
          category: activeFilter !== 'all' ? activeFilter : null,
          limitCount: 50
        });
        setFilteredBlogs(result);
      } else {
        // Get blogs by category
        const options = {
          status: 'published',
          limitCount: 50
        };
        
        if (activeFilter !== 'all') {
          options.category = activeFilter;
        }

        result = await getBlogs(options);
        setFilteredBlogs(result.blogs);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      setFilteredBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeFilter]);

  // Load blogs from Firebase
  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleFilterClick = (category) => {
    setActiveFilter(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBlogClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Search Bar */}
      <div className="w-full z-40 sticky top-20 bg-white shadow-sm">
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
      <div className="filter-buttons max-w-5xl mx-auto px-4 py-4 mt-20">
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
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="blog-card bg-white rounded-lg shadow-lg cursor-pointer overflow-hidden hover:shadow-xl hover:scale-105 transition-shadow duration-300 cursor-pointer"
                onClick={() => handleBlogClick(blog.slug)}
              >
                <div className="relative">
                  <img
                    src={blog.featuredImage || blog.image || 'https://via.placeholder.com/400x200?text=Blog+Image'}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="badge bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {blog.category || 'Blog'}
                    </span>
                  </div>
                </div>
                
                <div className="blog-content p-6">
                  <h2 className="blog-title text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="blog-desc text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt || blog.description || blog.content?.substring(0, 150) + '...'}
                  </p>
                  <p className="blog-meta text-sm text-gray-500 mb-4">
                    Author: {blog.author} | {formatDate(blog.publishedAt || blog.createdAt)} | {blog.viewCount || 0} views
                  </p>
                  <div className="read-more text-orange-500 font-medium hover:text-orange-600 transition-colors">
                    Read Full →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && filteredBlogs.length === 0 && (
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
