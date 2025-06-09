import { notFound } from "next/navigation";
import Image from "next/image";

import { mockAnnouncements } from '@/lib/mockData';
import { Announcement } from '@/types';
import styles from './AnnouncementDetails.module.scss';

interface AnnouncementPageProps {
    params: {
        id: string;
    };
}

async function getAnnouncement(id: string): Promise<Announcement | undefined> {
    return mockAnnouncements.find((ann) => ann.id === id);
}

export default async function AnnouncementPage({
    params,
}: AnnouncementPageProps) {
    const { id } = params;

    const announcement = await getAnnouncement(id);

    if (!announcement) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>{announcement.title}</h1>
                <p className={styles.price}>
                    {announcement.price.toLocaleString("ru-RU")} ₽
                </p>
                <p className={styles.city}>{announcement.city}</p>
                <p className={styles.description}>{announcement.description}</p>

                {announcement.images && announcement.images.length > 0 && (
                    <div className={styles.imageGallery}>
                        {announcement.images.map((imgSrc, index) => (
                            <div key={index} className={styles.imageWrapper}>
                                <Image
                                    src={imgSrc}
                                    alt={`${announcement.title} image ${
                                        index + 1
                                    }`}
                                    width={600}
                                    height={400}
                                    style={{ objectFit: "contain" }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {announcement.categories &&
                    announcement.categories.length > 0 && (
                        <p className={styles.categories}>
                            Категории:{" "}
                            {announcement.categories
                                .map((cat) => cat.name)
                                .join(", ")}
                        </p>
                    )}
                {announcement.subcategories &&
                    announcement.subcategories.length > 0 && (
                        <p className={styles.subcategories}>
                            Подкатегории:{" "}
                            {announcement.subcategories
                                .map((subcat) => subcat.name)
                                .join(", ")}
                        </p>
                    )}
                <p className={styles.createdAt}>
                    Опубликовано:{" "}
                    {new Date(announcement.createdAt).toLocaleDateString()}
                </p>
            </main>
        </div>
    );
}
