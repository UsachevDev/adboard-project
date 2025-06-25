import React from "react";
import { UserProfile } from "@/types";

interface UserReviewsProps {
    user: UserProfile;
}

const UserReviews: React.FC<UserReviewsProps> = ({ user }) => {
    const reviews = user.reviews ?? [];
    const avg =
        reviews.length > 0
            ? (
                  reviews.reduce((acc, r) => acc + r.score, 0) / reviews.length
              ).toFixed(1)
            : null;

    return (
        <section style={{ marginTop: "2em" }}>
            <h2>Отзывы</h2>
            <div>
                <b>Средний рейтинг:</b> {avg ?? "—"}{" "}
                {reviews.length > 0 && <span>({reviews.length})</span>}
            </div>
            <ul style={{ padding: 0, listStyle: "none" }}>
                {reviews.length === 0 && <li>Пока нет отзывов</li>}
                {reviews.map((review) => (
                    <li
                        key={review.id}
                        style={{
                            marginBottom: 12,
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        <div>
                            Оценка: <b>{review.score}/10</b>
                        </div>
                        <div>{review.description}</div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default UserReviews;
