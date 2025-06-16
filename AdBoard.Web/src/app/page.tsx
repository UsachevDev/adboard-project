'use client';

import React, { useEffect, useState } from 'react';
import AnnouncementCard from "@/components/ui/AnnouncementCard/AnnouncementCard";
import CategoryGrid from "@/components/ui/CategoryGrid/CategoryGrid";
import { getMockAnnouncements, mockCategories } from "@/lib/mockData";
import { Announcement } from "@/types";
import styles from "@/styles/pages/Home.module.scss";

export default function HomePage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        const fetchAnnouncements = () => {
            const allAnnouncements = getMockAnnouncements();
            const latestAnnouncements = allAnnouncements
                                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                            .slice(0, 12);
            setAnnouncements(latestAnnouncements);
        };

        fetchAnnouncements();

        window.addEventListener('storage', fetchAnnouncements);

        return () => {
            window.removeEventListener('storage', fetchAnnouncements);
        };
    }, []);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <CategoryGrid items={mockCategories} basePath="/search" isCategoryGrid={true} />

                <hr className={styles.sectionDivider} />

                <h1 className={styles.title}>Последние объявления</h1>

                <div className={styles.grid}>
                    {announcements.length > 0 ? (
                        announcements.map((announcement) => (
                            <AnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                            />
                        ))
                    ) : (
                        <p className={styles.noAnnouncementsMessage}>Объявлений пока нет.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
