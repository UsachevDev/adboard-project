"use client";

import React, { useState, useEffect } from "react";
import styles from "./EditProfileForm.module.scss";
import api from "@/lib/api";
import { UserProfile } from "@/types/index";

interface EditProfileFormProps {
    initialData: UserProfile;
    onSave: (updatedData: UserProfile) => void;
    onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
    initialData,
    onSave,
    onCancel,
}) => {
    const [name, setName] = useState<string>(initialData.name ?? "");
    const [phoneNumber, setPhoneNumber] = useState<string>(
        initialData.phoneNumber ?? ""
    );
    const [city, setCity] = useState<string>(initialData.city ?? "");
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    useEffect(() => {
        setName(initialData.name ?? "");
        setPhoneNumber(initialData.phoneNumber ?? "");
        setCity(initialData.city ?? "");
    }, [initialData]);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const patch = {
                name,
                phoneNumber: phoneNumber || null,
                city: city || null,
            };
            const response = await api("/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error("Не удалось обновить профиль: " + text);
            }
            const result = await response.json();
            if (result.error) {
                throw new Error(result.error as string);
            }
            const updatedProfile: UserProfile = result.data;
            setMessage({ type: "success", text: "Профиль успешно обновлен!" });
            onSave(updatedProfile);
        } catch (err: unknown) {
            console.error("Ошибка при обновлении профиля:", err);
            const text =
                err instanceof Error
                    ? err.message
                    : "Ошибка при обновлении профиля.";
            setMessage({ type: "error", text });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Редактирование профиля</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        Email (не редактируется)
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={styles.input}
                        value={initialData.email}
                        disabled
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        Имя
                    </label>
                    <input
                        type="text"
                        id="name"
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber" className={styles.label}>
                        Номер телефона
                    </label>
                    <input
                        type="text"
                        id="phoneNumber"
                        className={styles.input}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="city" className={styles.label}>
                        Город
                    </label>
                    <input
                        type="text"
                        id="city"
                        className={styles.input}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                {message && (
                    <p
                        className={`${styles.message} ${
                            message.type === "success"
                                ? styles.success
                                : styles.error
                        }`}
                    >
                        {message.text}
                    </p>
                )}
                <div className={styles.buttonGroup}>
                    <button
                        type="submit"
                        className={styles.saveButton}
                        disabled={loading}
                    >
                        {loading ? "Сохранение..." : "Сохранить изменения"}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfileForm;
