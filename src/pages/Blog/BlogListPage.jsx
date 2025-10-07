import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getBlogs, getBlogCategories, getBlogTags, searchBlogs } from '../../firebase/blogService';
import { FaSearch, FaFilter, FaTimes, FaCalendarAlt, FaEye, FaTag } from 'react-icons/fa';

const BlogListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  const blogsPerPage = 9;

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCategory || selectedTag) {
      loadBlogs();
    }
  }, [selectedCategory, selectedTag]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [blogsResult, categoriesData, tagsData] = await Promise.all([
        getBlogs({ limitCount: blogsPerPage }),
        getBlogCategories(),
        getBlogTags()
      ]);

      setBlogs(blogsResult.blogs);
      setLastDoc(blogsResult.lastDoc);
      setHasMore(blogsResult.hasMore);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlogs = async (reset = false) => {
    try {
      setLoading(true);
      
      const options = {
        limitCount: blogsPerPage,
        category: selectedCategory || null,
        tag: selectedTag || null
      };

      if (!reset && lastDoc) {
        options.lastDoc = lastDoc;
      }

      const result = await getBlogs(options);
      
      if (reset) {
        setBlogs(result.blogs);
        setCurrentPage(1);
      } else {
        setBlogs(prev => [...prev, ...result.blogs]);
        setCurrentPage(prev => prev + 1);
      }
      
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadBlogs(true);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchBlogs(searchTerm, {
        category: selectedCategory || null,
        limitCount: 50
      });
      setBlogs(searchResults);
      setHasMore(false);
    } catch (error) {
      console.error('Error searching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setSelectedTag('');
    setSearchParams(category ? { category } : {});
  };

  const handleTagChange = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setSelectedCategory('');
    setSearchParams(tag ? { tag } : {});
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setSearchTerm('');
    setSearchParams({});
    loadBlogs(true);
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

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Spiritual Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover divine wisdom, temple stories, and spiritual guidance through our curated collection of articles.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </form>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-gray-700 font-medium">Categories:</span>
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    !selectedCategory
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedCategory === category
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Tag Filter */}
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-gray-700 font-medium">Tags:</span>
                <button
                  onClick={() => handleTagChange('')}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    !selectedTag
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All
                </button>
                {tags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagChange(tag)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedTag === tag
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <FaTag className="inline mr-1" />
                    {tag}
                  </button>
                ))}
              </div>

              {/* Clear Filters Button */}
              {(selectedCategory || selectedTag || searchTerm) && (
                <div className="flex justify-center">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTimes />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {searchTerm ? `Search results for "${searchTerm}"` : 'Showing'} {blogs.length} articles
            {selectedCategory && ` in ${selectedCategory}`}
            {selectedTag && ` tagged with ${selectedTag}`}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Featured Image */}
              {blog.featuredImage && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {blog.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt />
                    <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaEye />
                    <span>{blog.viewCount || 0}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="hover:text-orange-600 transition-colors"
                  >
                    {blog.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {truncateText(blog.excerpt || blog.content)}
                </p>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{blog.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <Link
                  to={`/blog/${blog.slug}`}
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
                >
                  Read More
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {blogs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !searchTerm && (
          <div className="text-center">
            <button
              onClick={() => loadBlogs()}
              disabled={loading}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More Articles'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
