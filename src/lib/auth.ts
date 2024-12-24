// TODO: Implement authentication logic

import { redirect } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { BasicUserInfo } from "@/lib/types";

export type UserRole = "admin" | "manager" | "tenant";

export const useAuth = () => {
  const isAuthenticated = async () => {
    try {
      const role = await getRole();
      return role !== undefined;
    } catch (error) {
      return false;
    }
  };

  const isAdmin = async () => {
    try {
      const role = await getRole();
      return role === "admin";
    } catch (error) {
      return false;
    }
  };

  const isManager = async () => {
    try {
      const role = await getRole();
      return role === "manager";
    } catch (error) {
      return false;
    }
  };

  const getUserInfo = async () => {
    try {
      const res = await invoke("get_user_info");
      return res as BasicUserInfo;
    } catch (error) {
      return undefined;
    }
  };

  const login = async (data: { username: string; password: string }) => {
    try {
      const res = await invoke("account_login", {
        username: data.username.toLowerCase(),
        password: data.password,
      });
      return res as string;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await invoke("account_logout");
      throw redirect({
        to: "/login",
      });
    } catch (error) {
      // throw error;
    }
  };

  const getRole = async () => {
    try {
      const res = await invoke("get_user_role");
      return res as UserRole;
    } catch (error) {
      return undefined;
    }
  };

  const getBasicUserInfo = async () => {
    try {
      const res = await invoke("get_basic_user_info");
      return res as {
        username: string;
        role: string;
      };
    } catch (error) {
      return undefined;
    }
  };

  return {
    isAuthenticated,
    getUserInfo,
    login,
    logout,
    isAdmin,
    isManager,
    getRole,
    getBasicUserInfo,
  };
};

export type AuthContext = ReturnType<typeof useAuth>;
