"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserProfile } from "@/types";
import { getCurrentUser, addToFavorites, removeFromFavorites, getAnnouncementById } from "@/lib/api";

interface UserContextData {
  user: UserProfile | null;
  refreshUser: () => Promise<void>;
  toggleFavorite: (announcementId: string) => Promise<void>;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const load = async () => {
    try {
      const profile = await getCurrentUser();
      setUser(profile);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("access_token")) {
      load();
    }
  }, []);

  const toggleFavorite = async (announcementId: string) => {
    if (!user) return;
    const isFav = user.favorites?.some((a) => a.id === announcementId);

    try {
      if (isFav) {
        await removeFromFavorites(announcementId);
        setUser((prev) =>
          prev ? { ...prev, favorites: prev.favorites.filter((a) => a.id !== announcementId) } : prev
        );
      } else {
        await addToFavorites(announcementId);
        const ann = await getAnnouncementById(announcementId);
        setUser((prev) =>
          prev ? { ...prev, favorites: [...(prev.favorites ?? []), ann] } : prev
        );
      }
    } catch (e) {
      // сейчас эти эндпоинты заглушки — не ломаем UI
      console.warn("toggleFavorite not available yet:", e);
    }
  };

  return (
    <UserContext.Provider value={{ user, refreshUser: load, toggleFavorite }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within UserProvider");
  return ctx;
};
