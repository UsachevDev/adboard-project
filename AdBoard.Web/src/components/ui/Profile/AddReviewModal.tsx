import React, { useState } from "react";
import { Announcement } from "@/types";
import { addReview } from "@/lib/api";

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
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    padding: 24,
                    borderRadius: 8,
                    minWidth: 300,
                }}
            >
                <h3>Оставить отзыв</h3>
                <div>
                    <label>Объявление:</label>
                    <select
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
                <div>
                    <label>Оценка:</label>
                    <input
                        type="number"
                        min={1}
                        max={10}
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label>Комментарий:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: 16 }}>
                    <button type="submit" disabled={loading}>
                        Отправить
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ marginLeft: 12 }}
                    >
                        Отмена
                    </button>
                </div>
                {error && <div style={{ color: "red" }}>{error}</div>}
            </form>
        </div>
    );
};

export default AddReviewModal;
