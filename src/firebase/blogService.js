import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
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
      orderByField = 'publishedAt',
      orderDirection = 'desc'
    } = options;

    let q = query(collection(db, BLOGS_COLLECTION));

    // Filter by status
    if (status) {
      q = query(q, where('status', '==', status));
    }

    // Filter by category
    if (category) {
      q = query(q, where('category', '==', category));
    }

    // Filter by tag
    if (tag) {
      q = query(q, where('tags', 'array-contains', tag));
    }

    // Order by
    q = query(q, orderBy(orderByField, orderDirection));

    // Limit
    q = query(q, limit(limitCount));

    // Start after (for pagination)
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const blogs = [];
    
    querySnapshot.forEach((doc) => {
      blogs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      blogs,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
      hasMore: querySnapshot.docs.length === limitCount
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
    const q = query(
      collection(db, BLOGS_COLLECTION),
      where('slug', '==', slug),
      where('status', '==', 'published')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Blog not found');
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting blog by slug:', error);
    throw error;
  }
};

// Get related blogs
export const getRelatedBlogs = async (currentBlogId, category, tags, limitCount = 3) => {
  try {
    let q = query(
      collection(db, BLOGS_COLLECTION),
      where('status', '==', 'published'),
      where('__name__', '!=', currentBlogId)
    );

    // Try to get blogs from same category first
    if (category) {
      q = query(q, where('category', '==', category));
    }

    q = query(q, orderBy('publishedAt', 'desc'), limit(limitCount));

    const querySnapshot = await getDocs(q);
    const blogs = [];
    
    querySnapshot.forEach((doc) => {
      blogs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // If we don't have enough blogs from same category, get more
    if (blogs.length < limitCount) {
      const remainingLimit = limitCount - blogs.length;
      const existingIds = blogs.map(blog => blog.id);
      
      let additionalQ = query(
        collection(db, BLOGS_COLLECTION),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(remainingLimit + existingIds.length)
      );

      const additionalSnapshot = await getDocs(additionalQ);
      const additionalBlogs = [];
      
      additionalSnapshot.forEach((doc) => {
        if (!existingIds.includes(doc.id)) {
          additionalBlogs.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });

      blogs.push(...additionalBlogs.slice(0, remainingLimit));
    }

    return blogs;
  } catch (error) {
    console.error('Error getting related blogs:', error);
    throw error;
  }
};

// Get blog categories
export const getBlogCategories = async () => {
  try {
    const q = query(collection(db, BLOGS_COLLECTION), where('status', '==', 'published'));
    const querySnapshot = await getDocs(q);
    
    const categories = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.category) {
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
    const q = query(collection(db, BLOGS_COLLECTION), where('status', '==', 'published'));
    const querySnapshot = await getDocs(q);
    
    const tags = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.tags && Array.isArray(data.tags)) {
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
    const q = query(
      collection(db, BLOGS_COLLECTION),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const blogs = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchableText = `${data.title} ${data.excerpt} ${data.content}`.toLowerCase();
      
      if (searchableText.includes(searchTerm.toLowerCase())) {
        // Filter by category if specified
        if (!category || data.category === category) {
          blogs.push({
            id: doc.id,
            ...data
          });
        }
      }
    });

    return blogs;
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
    const publishedQuery = query(
      collection(db, BLOGS_COLLECTION),
      where('status', '==', 'published')
    );
    
    const draftQuery = query(
      collection(db, BLOGS_COLLECTION),
      where('status', '==', 'draft')
    );

    const [publishedSnapshot, draftSnapshot] = await Promise.all([
      getDocs(publishedQuery),
      getDocs(draftQuery)
    ]);

    const totalViews = publishedSnapshot.docs.reduce((total, doc) => {
      return total + (doc.data().viewCount || 0);
    }, 0);

    return {
      totalPublished: publishedSnapshot.size,
      totalDrafts: draftSnapshot.size,
      totalViews
    };
  } catch (error) {
    console.error('Error getting blog stats:', error);
    throw error;
  }
};
