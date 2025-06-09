// Это Server Component по умолчанию
import AnnouncementCard from "@/components/ui/AnnouncementCard/AnnouncementCard";
import { mockAnnouncements } from "@/lib/mockData";
import { Announcement } from "@/types";
import styles from "@/styles/pages/Home.module.scss";

// Функция для получения данных (может быть async)
async function getAnnouncements(): Promise<Announcement[]> {
    // В реальном приложении здесь будет запрос к бэкенду
    // const res = await fetch('http://localhost:8080/api/announcements', { next: { revalidate: 60 } });
    // if (!res.ok) {
    //   throw new Error('Failed to fetch announcements');
    // }
    // return res.json();

    // Пока используем заглушки:
    return mockAnnouncements;
}

export default async function HomePage() {
    const announcements = await getAnnouncements();

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Последние объявления</h1>

                <div className={styles.grid}>
                    {announcements.map((announcement) => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
