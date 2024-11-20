// TODO: Implement authentication logic

import { redirect } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { BasicUserInfo } from "@/lib/types";

type UserRole = "Admin" | "Manager" | "Tenant";

export const useAuth = () => {
  const isAuthenticated = async () => {
    try {
      await invoke("check_token");
      return true;
    } catch (error) {
      return false;
    }
  };

  const isAdmin = async () => {
    try {
      await invoke("check_admin");
      return true;
    } catch (error) {
      return false;
    }
  };

  const isManager = async () => {
    try {
      await invoke("check_manager");
      return true;
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
      const res = await invoke("account_login", data);
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

  return {
    isAuthenticated,
    getUserInfo,
    login,
    logout,
    isAdmin,
    isManager,
    getRole,
  };
};

export type AuthContext = ReturnType<typeof useAuth>;
