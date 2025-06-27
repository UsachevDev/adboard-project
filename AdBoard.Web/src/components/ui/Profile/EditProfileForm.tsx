"use client";

import React, { useState, useEffect } from "react";
import styles from "./EditProfileForm.module.scss";
import { updateCurrentUser } from "@/lib/api";
import { UserProfile } from "@/types";

interface EditProfileFormProps {
    initialData: UserProfile;
    onSave: () => void;
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
            await updateCurrentUser({
                name,
                phoneNumber: phoneNumber || null,
                city: city || null,
            });
            setMessage({ type: "success", text: "Профиль успешно обновлен!" });
            onSave();
        } catch (err: unknown) {
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
                    <label htmlFor="name" className={styles.label}>
                        Имя
                    </label>
                    <input
                        id="name"
                        type="text"
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
                        id="phoneNumber"
                        type="text"
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
                        id="city"
                        type="text"
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
