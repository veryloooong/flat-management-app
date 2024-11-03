// TODO: Implement authentication logic

import { redirect } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { BasicUserInfo } from "./user";

export const useAuth = () => {
  const checkAuthentication = async () => {
    try {
      const res = await invoke('get_user_info');
      return res as BasicUserInfo;
      // return res as boolean;
    } catch (error) {
      return undefined;
    }
  }

  const login = async (data: { username: string, password: string }) => {
    try {
      const res = await invoke('account_login', data);
      return res as string;
    } catch (error) {
      throw error;
    }
  }

  const logout = async () => {
    try {
      await invoke('account_logout');
      throw redirect({
        to: '/login'
      })
    } catch (error) {
      throw error;
    }
  }

  return { isAuthenticated: checkAuthentication, login, logout }
}

export type AuthContext = ReturnType<typeof useAuth>;
