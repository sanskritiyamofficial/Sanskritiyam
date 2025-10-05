import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogBySlug } from '../../data/blogData';
import './BlogDetailPage.css';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundBlog = getBlogBySlug(slug);
    if (foundBlog) {
      setBlog(foundBlog);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
          <button
            onClick={() => navigate('/blogs')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-white shadow fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/img/Hindu Mandir Puja logo (2).png" 
              alt="Logo" 
              className="h-10"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-xl font-bold text-orange-600">हिन्दू मंदिर पूजा</h1>
              <p className="text-xs text-gray-500">आपका विश्वास & हमारी सेवा</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-orange-500 transition-colors"
            >
              होम
            </button>
            <button 
              onClick={() => navigate('/pujas')}
              className="hover:text-orange-500 transition-colors"
            >
              पूजाएं
            </button>
            <button 
              onClick={() => navigate('/chadhawa')}
              className="hover:text-orange-500 transition-colors"
            >
              प्रसाद
            </button>
            <button 
              onClick={() => navigate('/blogs')}
              className="hover:text-orange-500 transition-colors"
            >
              ब्लॉग्स
            </button>
          </div>
        </nav>
      </header>

      {/* Floating CTA Button */}
      <button
        onClick={() => navigate('/pujas')}
        className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition"
      >
        <i className="fas fa-om"></i>
        <span className="hidden sm:inline">पूजा बुक करें</span>
      </button>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blog Content */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>
            <p className="text-sm text-gray-600 mb-6">
              लेखक: <span className="font-medium">{blog.author}</span> | {blog.date} | {blog.readTime}
            </p>

            <div className="prose prose-lg max-w-none">
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">टैग्स:</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Puja Cards for Desktop */}
        <aside className="space-y-6 hidden lg:block">
          <div className="sticky top-32 space-y-6">
            {blog.relatedPujas.map((puja, index) => (
              <div key={index} className="bg-white shadow-md rounded-xl overflow-hidden border border-purple-200">
                <img 
                  src={puja.image} 
                  alt={puja.title} 
                  className="w-full h-50 object-cover"
                />
                <div className="p-4">
                  <div className="flex gap-2 mb-2">
                    {puja.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-lg font-bold text-purple-800 mb-2">{puja.title}</h2>
                  <p className="text-sm text-gray-700 mb-3">{puja.description}</p>
                  <button
                    onClick={() => window.open(puja.link, '_blank')}
                    className="block w-full text-center bg-purple-700 text-white py-2 rounded-md font-semibold hover:bg-purple-800 transition-colors"
                  >
                    🙏 पूजा बुक करें
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>

      {/* Mobile Puja Cards at Bottom */}
      <div className="block lg:hidden px-4 space-y-6 pb-16">
        {blog.relatedPujas.map((puja, index) => (
          <div key={index} className="bg-white shadow-md rounded-xl overflow-hidden border border-purple-200">
            <img 
              src={puja.image} 
              alt={puja.title} 
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <div className="flex gap-2 mb-2">
                {puja.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-bold text-purple-800 mb-2">{puja.title}</h2>
              <p className="text-sm text-gray-700 mb-3">{puja.description}</p>
              <button
                onClick={() => window.open(puja.link, '_blank')}
                className="block w-full text-center bg-purple-700 text-white py-2 rounded-md font-semibold hover:bg-purple-800 transition-colors"
              >
                🙏 पूजा बुक करें
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-[#FEF7ED] text-black pt-16 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex gap-3 items-center mb-4">
                <img 
                  src="/assets/img/Hindu Mandir Puja logo (2).png" 
                  className="h-12" 
                  alt="Logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <h2 className="text-xl font-bold">हिंदू मंदिर पूजा</h2>
              </div>
              <p>We connect you with sacred rituals & temples across India.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">सेवाएं</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/pujas')}
                    className="hover:text-orange-500 transition-colors"
                  >
                    पूजा
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/chadhawa')}
                    className="hover:text-orange-500 transition-colors"
                  >
                    चढ़ावा
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">नीतियां</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/privacy-policy')}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/terms-and-conditions')}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Terms
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/return-policy')}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Refund
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">संपर्क करें</h3>
              <p>वाराणसी U.P 221001</p>
              <p>📞 8009018678</p>
              <p>📧 hindumandirpuja@gmail.com</p>
            </div>
          </div>
          <div className="text-center mt-10 border-t pt-4 text-sm">© 2024 Hindu Mandir Puja Pvt. Ltd.</div>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetailPage;
