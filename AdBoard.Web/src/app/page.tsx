'use client';

import React, { useEffect, useState } from 'react';
import AnnouncementCard from "@/components/ui/AnnouncementCard/AnnouncementCard";
import { getMockAnnouncements } from "@/lib/mockData";
import { Announcement } from "@/types";
import styles from "@/styles/pages/Home.module.scss";

export default function HomePage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        const fetchAnnouncements = () => {
            setAnnouncements(getMockAnnouncements());
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
                        <p>Объявлений пока нет.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
