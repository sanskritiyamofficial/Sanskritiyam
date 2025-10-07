import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  getBlogBySlug,
  getRelatedBlogs,
  incrementViewCount,
} from "../../firebase/blogService";
import {
  FaCalendarAlt,
  FaEye,
  FaUser,
  FaTag,
  FaArrowLeft,
  FaShareAlt,
} from "react-icons/fa";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      setError(null);

      const blogData = await getBlogBySlug(slug);
      setBlog(blogData);

      // Increment view count
      await incrementViewCount(blogData.id);

      // Load related blogs
      const related = await getRelatedBlogs(
        blogData.id,
        blogData.category,
        blogData.tags || [],
        3
      );
      setRelatedBlogs(related);
    } catch (err) {
      console.error("Error loading blog:", err);
      setError("Blog not found");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
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

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Blog Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle || blog.title} | Sanskritiyam</title>
        <meta
          name="description"
          content={blog.metaDescription || blog.excerpt}
        />
        <meta name="keywords" content={blog.tags ? blog.tags.join(", ") : ""} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.featuredImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Sanskritiyam" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={blog.featuredImage} />

        {/* Article specific */}
        <meta
          property="article:published_time"
          content={blog.publishedAt?.toDate?.()?.toISOString()}
        />
        <meta property="article:author" content={blog.author} />
        <meta property="article:section" content={blog.category} />
        {blog.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt />
                  <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaEye />
                  <span>{blog.viewCount || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaUser />
                  <span>{blog.author}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                >
                  <FaShareAlt />
                  Share
                </button>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              {/* Category and Tags */}
              <div className="flex flex-wrap gap-4 items-center">
                {blog.category && (
                  <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
                    {blog.category}
                  </span>
                )}
                {blog.tags &&
                  blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      <FaTag className="text-xs" />
                      {tag}
                    </span>
                  ))}
              </div>
            </header>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="mb-8">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <div
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: blog.content.replace(/\n/g, "<br />"),
                }}
              />
            </article>

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-white rounded-xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-2xl text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {blog.author.trim().replace("@sanskritiyam.com", "")}
                  </h3>
                  <p className="text-gray-600">
                    Spiritual writer and devotee sharing divine wisdom and
                    temple stories.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <article
                      key={relatedBlog.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      {relatedBlog.featuredImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={relatedBlog.featuredImage}
                            alt={relatedBlog.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {relatedBlog.category}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt />
                            <span>
                              {formatDate(
                                relatedBlog.publishedAt || relatedBlog.createdAt
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaEye />
                            <span>{relatedBlog.viewCount || 0}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                          <Link
                            to={`/blog/${relatedBlog.slug}`}
                            className="hover:text-orange-600 transition-colors"
                          >
                            {relatedBlog.title}
                          </Link>
                        </h3>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {relatedBlog.excerpt ||
                            relatedBlog.content?.substr(0, 150) + "..."}
                        </p>

                        <Link
                          to={`/blog/${relatedBlog.slug}`}
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
              </section>
            )}

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready for Your Spiritual Journey?
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Book a puja and experience divine blessings at our sacred
                temples.
              </p>
              <Link
                to="/pooja-booking"
                className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Book Puja Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;
