import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { AuthContext } from "./useGetAuth";



export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return result;
  };

  // Sign in function
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  // Sign out function
  const logout = async () => {
    await signOut(auth);
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Check if user is admin
  const isAdmin = (user) => {
    if (!user) return false;
    // You can customize this logic based on your admin requirements
    // For now, we'll check if the email contains 'admin' or is a specific admin email
    const adminEmails = [
      "admin@sanskritiyam.com",
      "kartik@sanskritiyam.com",
      "support@sanskritiyam.com",
    ];
    return adminEmails.includes(user.email) || user.email.includes("admin");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateUserProfile,
    isAdmin: isAdmin(currentUser),
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
