// AdBoard.Web/src/context/UserContext.tsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { UserProfile, Announcement } from "@/types";
import {
    getCurrentUser,
    addToFavorites,
    removeFromFavorites,
    getAnnouncementById,
} from "@/lib/api";

interface UserContextData {
    user: UserProfile | null;
    favSet: Set<string>;
    toggleFavorite: (id: string) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [favSet, setFavSet] = useState<Set<string>>(new Set());

    const loadUser = async () => {
        try {
            const profile = await getCurrentUser();
            setUser(profile);
            setFavSet(new Set(profile.favourites?.map((a) => a.id) ?? []));
        } catch {
            setUser(null);
            setFavSet(new Set());
        }
    };

    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            loadUser();
        }
    }, []);

    const toggleFavorite = async (announcementId: string) => {
        if (!user) return;
        const isFav = favSet.has(announcementId);
        try {
            if (isFav) {
                await removeFromFavorites(announcementId);
                setFavSet((prev) => {
                    const next = new Set(prev);
                    next.delete(announcementId);
                    return next;
                });
                setUser((prev) =>
                    prev
                        ? {
                              ...prev,
                              favourites: prev.favourites.filter(
                                  (a) => a.id !== announcementId
                              ),
                          }
                        : prev
                );
            } else {
                await addToFavorites(announcementId);
                const newAnn = await getAnnouncementById(announcementId);
                setFavSet((prev) => new Set(prev).add(announcementId));
                setUser((prev) =>
                    prev
                        ? {
                              ...prev,
                              favourites: [...(prev.favourites ?? []), newAnn],
                          }
                        : prev
                );
            }
        } catch (err) {
            console.error("Ошибка переключения избранного:", err);
        }
    };

    return (
        <UserContext.Provider
            value={{ user, favSet, toggleFavorite, refreshUser: loadUser }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = (): UserContextData => {
    const ctx = useContext(UserContext);
    if (!ctx)
        throw new Error("useUserContext must be used within UserProvider");
    return ctx;
};
