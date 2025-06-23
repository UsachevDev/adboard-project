"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { UserProfile } from "@/types";
import { getCurrentUser, addToFavorites, removeFromFavorites } from "@/lib/api";

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
            } else {
                await addToFavorites(announcementId);
                setFavSet((prev) => {
                    const next = new Set(prev);
                    next.add(announcementId);
                    return next;
                });
            }
        } catch (err: unknown) {
            console.error("Ошибка переключения избранного:", err);
            setFavSet((prev) => {
                const next = new Set(prev);
                if (isFav) next.add(announcementId);
                else next.delete(announcementId);
                return next;
            });
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
