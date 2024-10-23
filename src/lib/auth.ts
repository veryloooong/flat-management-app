// TODO: Implement authentication logic

import { redirect } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";

export const useAuth = () => {
  const isAuthenticated = async () => {
    try {
      // const res = await invoke('account_check');
      // return res as boolean;
      return true;
    } catch (error) {
      throw error;
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

  return { isAuthenticated, login, logout }
}

export type AuthContext = ReturnType<typeof useAuth>;
