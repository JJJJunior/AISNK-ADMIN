import React, { createContext, ReactNode, useEffect, useState } from "react";
import { UserType } from "../lib/types";
import { Cookies, useCookies } from "react-cookie";
import { validate } from "../lib/actions.ts";
import { useNavigate } from "react-router-dom";

// 定义 AuthContext 的类型
interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  logout: () => void;
}

// 创建 AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);

// 创建 AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [cookies, removeCookie] = useCookies(["Authorization"]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const logout = async () => {
    setUser(null);
    removeCookie("Authorization", "");
  };
  const checkUserInfo = async () => {
    setLoading(true);
    try {
      const res = await validate();
      if (res.status === 200) {
        setUser(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      // console.log(err);
      navigate("/login");
      // window.location.href = "/login";
    }
  };
  useEffect(() => {
    checkUserInfo().then();
  }, []);

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
};
