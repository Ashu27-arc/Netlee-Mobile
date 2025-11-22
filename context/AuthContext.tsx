import { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  favorites?: string[];
};

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (data: any) => {
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  const updateUser = async () => {
    const u = await AsyncStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  };

  useEffect(() => {
    updateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
