"use client";

import React, { useState } from "react";
import { Announcement } from "@/types";
import { addReview } from "@/lib/api";
import styles from "./AddReviewModal.module.scss";

interface AddReviewModalProps {
    announcements: Announcement[];
    onClose: () => void;
    onAdded: () => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
    announcements,
    onClose,
    onAdded,
}) => {
    const [announcementId, setAnnouncementId] = useState(
        announcements[0]?.id || ""
    );
    const [score, setScore] = useState(10);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await addReview(announcementId, score, description);
            onAdded();
        } catch (e: any) {
            setError(e.message || "Ошибка");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <form onSubmit={handleSubmit} className={styles.modal}>
                <h3 className={styles.header}>Оставить отзыв</h3>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Объявление:</label>
                    <select
                        className={styles.select}
                        value={announcementId}
                        onChange={(e) => setAnnouncementId(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Выберите объявление
                        </option>
                        {announcements.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Оценка:</label>
                    <input
                        className={styles.input}
                        type="number"
                        min={1}
                        max={10}
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Комментарий:</label>
                    <textarea
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className={styles.actions}>
                    <button
                        type="submit"
                        className={styles.btnPrimary}
                        disabled={loading}
                    >
                        Отправить
                    </button>
                    <button
                        type="button"
                        className={styles.btnSecondary}
                        onClick={onClose}
                    >
                        Отмена
                    </button>
                </div>

                {error && <div className={styles.error}>{error}</div>}
            </form>
        </div>
    );
};

export default AddReviewModal;