import { useContext } from "react";
import { createContext } from "react";

export const AuthContext = createContext();

export const useGetAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useGetAuth must be used within an AuthProvider");
  }
  return context;
};
