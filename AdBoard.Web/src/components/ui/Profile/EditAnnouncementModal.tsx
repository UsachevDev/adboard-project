"use client";

import React, { useState, FormEvent } from "react";
import Modal from "@/components/ui/Modal/Modal";
import styles from "./EditAnnouncementModal.module.scss";
import { Announcement, UpdateAnnouncementRequest } from "@/types";
import { updateAnnouncement } from "@/lib/api";

interface Props {
    announcement: Announcement;
    onClose: () => void;
    onUpdated: () => void;
}

export default function EditAnnouncementModal({
    announcement,
    onClose,
    onUpdated,
}: Props) {
    const [title, setTitle] = useState(announcement.title);
    const [description, setDescription] = useState(announcement.description);
    const [price, setPrice] = useState<number>(announcement.price);
    const [city, setCity] = useState(announcement.city);
    const [count, setCount] = useState<number>(announcement.count);
    const [isHidden, setIsHidden] = useState<boolean>(announcement.isHidden);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const payload: UpdateAnnouncementRequest = {
            title,
            description,
            price,
            city,
            count,
            isHidden,
        };
        try {
            await updateAnnouncement(announcement.id, payload);
            onUpdated();
        } catch (err) {
            console.error("Ошибка при обновлении:", err);
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className={styles.container}>
                <h2 className={styles.title}>Редактировать объявление</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>Заголовок</label>
                    <input
                        type="text"
                        value={title}
                        maxLength={100}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label>Описание</label>
                    <textarea
                        value={description}
                        maxLength={1000}
                        rows={4}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label>Цена (₽)</label>
                    <input
                        type="number"
                        value={price}
                        min={0}
                        step={0.01}
                        onChange={(e) => setPrice(+e.target.value)}
                        required
                    />

                    <label>Город</label>
                    <input
                        type="text"
                        value={city}
                        maxLength={50}
                        onChange={(e) => setCity(e.target.value)}
                    />

                    <label>Количество</label>
                    <input
                        type="number"
                        value={count}
                        min={1}
                        onChange={(e) => setCount(+e.target.value)}
                    />

                    <div className={styles.hiddenToggle}>
                        <input
                            id="hidden"
                            type="checkbox"
                            checked={isHidden}
                            onChange={(e) => setIsHidden(e.target.checked)}
                        />
                        <label htmlFor="hidden">Скрыть объявление</label>
                    </div>

                    <div className={styles.buttons}>
                        <button type="button" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? "Сохранение..." : "Сохранить"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
