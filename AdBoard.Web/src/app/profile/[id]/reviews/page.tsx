"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserById } from "@/lib/api";
import { UserProfile, Announcement } from "@/types";
import styles from "./UserReviewsPage.module.scss";
import AddReviewModal from "@/components/ui/Profile/AddReviewModal";

const UserReviewsPage: React.FC = () => {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const [user, setUser] = useState<UserProfile | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        if (!id) return;
        console.log("useEffect: запрашиваем профиль пользователя с id =", id);
        getUserById(id)
            .then((profile) => {
                console.log("Получен профиль пользователя:", profile);
                setUser(profile);
                // Дебажим наличие поля announcements:
                if (profile.announcements) {
                    console.log(
                        "Найдены объявления в профиле:",
                        profile.announcements
                    );
                } else {
                    console.warn("Объявления не найдены в профиле!");
                }
                setAnnouncements(profile.announcements || []);
            })
            .catch((e) => {
                console.error("Ошибка загрузки профиля:", e);
            });
    }, [id]);

    useEffect(() => {
        // Лог после обновления состояния
        console.log("Текущее состояние: user =", user);
        console.log("Текущее состояние: announcements =", announcements);
    }, [user, announcements]);

    if (!user) return <div>Загрузка...</div>;

    const reviews = user.reviews ?? [];
    const avg =
        reviews.length > 0
            ? (
                  reviews.reduce((acc, r) => acc + r.score, 0) / reviews.length
              ).toFixed(1)
            : null;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                Отзывы о пользователе {user.name || user.email}
            </h2>
            <div>
                <b>Средний рейтинг:</b> {avg ?? "—"}
                {reviews.length > 0 && <span> ({reviews.length})</span>}
            </div>
            <button
                onClick={() => {
                    console.log("Нажата кнопка добавить отзыв");
                    setShowAdd(true);
                }}
                className={styles.addBtn}
            >
                Добавить отзыв
            </button>
            <ul className={styles.reviewsList}>
                {reviews.length === 0 && <li>Пока нет отзывов</li>}
                {reviews.map((review) => (
                    <li key={review.id} className={styles.reviewItem}>
                        <div className={styles.reviewScore}>
                            Оценка: <b>{review.score}/10</b>
                        </div>
                        <div className={styles.reviewDesc}>
                            {review.description}
                        </div>
                    </li>
                ))}
            </ul>

            {showAdd && (
                <AddReviewModal
                    announcements={announcements}
                    onClose={() => setShowAdd(false)}
                    onAdded={() => {
                        setShowAdd(false);
                        // Проверяем обновление после добавления
                        getUserById(id).then((profile) => {
                            console.log(
                                "Обновили профиль после добавления:",
                                profile
                            );
                            setUser(profile);
                            setAnnouncements(profile.announcements || []);
                        });
                    }}
                />
            )}
        </div>
    );
};

export default UserReviewsPage;
