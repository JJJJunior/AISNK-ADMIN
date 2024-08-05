import React, { createContext, ReactNode, useEffect, useState } from "react";
import { UserType } from "../lib/types";
import { useCookies } from "react-cookie";
import { validate } from "../lib/actions.ts";

// 定义 AuthContext 的类型
interface AuthContextType {
  user: UserType | null;
  validate: () => UserType;
}

// 创建 AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);

// 创建 AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(["Authorization"]);
  const [loading, setLoading] = useState(true);
  const logout = () => {
    setUser(null);
    removeCookie("Authorization");
  };
  const checkUserInfo = async () => {
    try {
      const res = await validate(cookies);
      if (res.status === 200) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkUserInfo().then();
  }, []);

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
};
