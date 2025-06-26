// AdBoard.Web/src/context/UserContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile } from "@/types";
import { getCurrentUser, addToFavorites, removeFromFavorites, getAnnouncementById } from "@/lib/api";

interface UserContextData {
    user: UserProfile | null;
    toggleFavorite: (id: string) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    const loadUser = async () => {
        try {
            const profile = await getCurrentUser();
            setUser(profile);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            loadUser();
        }
    }, []);

    const toggleFavorite = async (announcementId: string) => {
        if (!user) return;

        const isFav = user.favorites?.some(a => a.id === announcementId);
        try {
            if (isFav) {
                // удалить из избранного
                await removeFromFavorites(announcementId);
                setUser(prev =>
                    prev
                        ? {
                            ...prev,
                            favorites: prev.favorites.filter(a => a.id !== announcementId),
                        }
                        : prev
                );
            } else {
                // добавить в избранное
                await addToFavorites(announcementId);
                // подтягиваем сам объект объявления, чтобы положить в список
                const newAnn = await getAnnouncementById(announcementId);
                setUser(prev =>
                    prev
                        ? {
                            ...prev,
                            favorites: [...(prev.favorites ?? []), newAnn],
                        }
                        : prev
                );
            }
        } catch (err) {
            console.error("Ошибка переключения избранного:", err);
        }
    };

    return (
        <UserContext.Provider value={{ user, toggleFavorite, refreshUser: loadUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = (): UserContextData => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUserContext must be used within UserProvider");
    return ctx;
};
