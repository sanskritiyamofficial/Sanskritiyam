import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

const BLOGS_COLLECTION = 'blogs';

// Create a new blog post
export const createBlog = async (blogData) => {
  try {
    const blogWithTimestamp = {
      ...blogData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: blogData.status === 'published' ? serverTimestamp() : null,
      slug: generateSlug(blogData.title),
      viewCount: 0,
      likes: 0
    };

    const docRef = await addDoc(collection(db, BLOGS_COLLECTION), blogWithTimestamp);
    return { id: docRef.id, ...blogWithTimestamp };
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// Update an existing blog post
export const updateBlog = async (blogId, blogData) => {
  try {
    const blogRef = doc(db, BLOGS_COLLECTION, blogId);
    const updateData = {
      ...blogData,
      updatedAt: serverTimestamp(),
      slug: generateSlug(blogData.title),
      publishedAt: blogData.status === 'published' && !blogData.publishedAt ? serverTimestamp() : blogData.publishedAt
    };

    await updateDoc(blogRef, updateData);
    return { id: blogId, ...updateData };
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

// Delete a blog post
export const deleteBlog = async (blogId) => {
  try {
    const blogRef = doc(db, BLOGS_COLLECTION, blogId);
    await deleteDoc(blogRef);
    return true;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

// Get all blogs with pagination
export const getBlogs = async (options = {}) => {
  try {
    const {
      status = 'published',
      category = null,
      tag = null,
      limitCount = 10,
      lastDoc = null,
      orderDirection = 'desc'
    } = options;

    let q = query(collection(db, BLOGS_COLLECTION));

    // For now, let's use a simple approach that doesn't require composite indexes
    // We'll filter in memory after fetching to avoid index issues
    const querySnapshot = await getDocs(q);
    let blogs = [];
    
    querySnapshot.forEach((doc) => {
      blogs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Filter by status
    if (status && status !== 'all') {
      blogs = blogs.filter(blog => blog.status === status);
    }

    // Filter by category
    if (category) {
      blogs = blogs.filter(blog => blog.category === category);
    }

    // Filter by tag
    if (tag) {
      blogs = blogs.filter(blog => blog.tags && blog.tags.includes(tag));
    }

    // Sort by createdAt
    blogs.sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return orderDirection === 'desc' ? bTime - aTime : aTime - bTime;
    });

    // Apply pagination
    const startIndex = lastDoc ? blogs.findIndex(blog => blog.id === lastDoc.id) + 1 : 0;
    const paginatedBlogs = blogs.slice(startIndex, startIndex + limitCount);

    return {
      blogs: paginatedBlogs,
      lastDoc: paginatedBlogs.length > 0 ? paginatedBlogs[paginatedBlogs.length - 1] : null,
      hasMore: paginatedBlogs.length === limitCount
    };
  } catch (error) {
    console.error('Error getting blogs:', error);
    throw error;
  }
};

// Get a single blog by ID
export const getBlogById = async (blogId) => {
  try {
    const blogRef = doc(db, BLOGS_COLLECTION, blogId);
    const blogSnap = await getDoc(blogRef);
    
    if (blogSnap.exists()) {
      return { id: blogSnap.id, ...blogSnap.data() };
    } else {
      throw new Error('Blog not found');
    }
  } catch (error) {
    console.error('Error getting blog by ID:', error);
    throw error;
  }
};

// Get a single blog by slug
export const getBlogBySlug = async (slug) => {
  try {
    // Get all blogs and filter in memory to avoid index issues
    const q = query(collection(db, BLOGS_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      
      // Check if this blog matches the slug and is published
      if (data.slug === slug && data.status === 'published') {
        return { id: doc.id, ...data };
      }
    }
    
    // If no blog found with the slug and published status
    throw new Error('Blog not found');
  } catch (error) {
    console.error('Error getting blog by slug:', error);
    throw error;
  }
};

// Get related blogs
export const getRelatedBlogs = async (currentBlogId, category, tags, limitCount = 3) => {
  try {
    // Get all published blogs and filter in memory
    const q = query(collection(db, BLOGS_COLLECTION));
    const querySnapshot = await getDocs(q);
    const allBlogs = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'published' && doc.id !== currentBlogId) {
        allBlogs.push({
          id: doc.id,
          ...data
        });
      }
    });

    // Sort by publishedAt or createdAt
    allBlogs.sort((a, b) => {
      const aTime = a.publishedAt?.toDate ? a.publishedAt.toDate() : 
                   a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
      const bTime = b.publishedAt?.toDate ? b.publishedAt.toDate() : 
                   b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
      return bTime - aTime;
    });

    // Try to get blogs from same category first
    let relatedBlogs = [];
    if (category) {
      relatedBlogs = allBlogs.filter(blog => blog.category === category);
    }

    // If we don't have enough from same category, add more from all blogs
    if (relatedBlogs.length < limitCount) {
      const existingIds = relatedBlogs.map(blog => blog.id);
      const additionalBlogs = allBlogs.filter(blog => !existingIds.includes(blog.id));
      relatedBlogs.push(...additionalBlogs.slice(0, limitCount - relatedBlogs.length));
    }

    return relatedBlogs.slice(0, limitCount);
  } catch (error) {
    console.error('Error getting related blogs:', error);
    throw error;
  }
};

// Get blog categories
export const getBlogCategories = async () => {
  try {
    // Get all blogs and filter in memory
    const q = query(collection(db, BLOGS_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    const categories = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'published' && data.category) {
        categories.add(data.category);
      }
    });

    return Array.from(categories);
  } catch (error) {
    console.error('Error getting blog categories:', error);
    throw error;
  }
};

// Get blog tags
export const getBlogTags = async () => {
  try {
    // Get all blogs and filter in memory
    const q = query(collection(db, BLOGS_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    const tags = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'published' && data.tags && Array.isArray(data.tags)) {
        data.tags.forEach(tag => tags.add(tag));
      }
    });

    return Array.from(tags);
  } catch (error) {
    console.error('Error getting blog tags:', error);
    throw error;
  }
};

// Increment view count
export const incrementViewCount = async (blogId) => {
  try {
    const blogRef = doc(db, BLOGS_COLLECTION, blogId);
    const blogSnap = await getDoc(blogRef);
    
    if (blogSnap.exists()) {
      const currentViews = blogSnap.data().viewCount || 0;
      await updateDoc(blogRef, {
        viewCount: currentViews + 1
      });
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
    // Don't throw error for view count increment
  }
};

// Search blogs
export const searchBlogs = async (searchTerm, options = {}) => {
  try {
    const { limitCount = 10, category = null } = options;
    
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation. For production, consider using Algolia or similar
    
    // Get all published blogs first
    const q = query(collection(db, BLOGS_COLLECTION));
    const querySnapshot = await getDocs(q);
    const blogs = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Only include published blogs
      if (data.status === 'published') {
        const searchableText = `${data.title} ${data.excerpt || ''} ${data.content || ''}`.toLowerCase();
        
        if (searchableText.includes(searchTerm.toLowerCase())) {
          // Filter by category if specified
          if (!category || data.category === category) {
            blogs.push({
              id: doc.id,
              ...data
            });
          }
        }
      }
    });

    // Sort by publishedAt or createdAt
    blogs.sort((a, b) => {
      const aTime = a.publishedAt?.toDate ? a.publishedAt.toDate() : 
                   a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
      const bTime = b.publishedAt?.toDate ? b.publishedAt.toDate() : 
                   b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
      return bTime - aTime;
    });

    // Apply limit
    return blogs.slice(0, limitCount);
  } catch (error) {
    console.error('Error searching blogs:', error);
    throw error;
  }
};

// Generate SEO-friendly slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
};

// Get blog statistics for admin
export const getBlogStats = async () => {
  try {
    // Get all blogs and filter in memory
    const q = query(collection(db, BLOGS_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    let totalPublished = 0;
    let totalDrafts = 0;
    let totalViews = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'published') {
        totalPublished++;
        totalViews += data.viewCount || 0;
      } else if (data.status === 'draft') {
        totalDrafts++;
      }
    });

    return {
      totalPublished,
      totalDrafts,
      totalViews
    };
  } catch (error) {
    console.error('Error getting blog stats:', error);
    throw error;
  }
};
