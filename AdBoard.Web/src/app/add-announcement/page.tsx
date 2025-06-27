"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./AddAnnouncementPage.module.scss";
import { getCategories, addAnnouncement } from "@/lib/api";
import { CategoryDto } from "@/lib/api";
import { AddAnnouncementRequest } from "@/types";

export default function AddAnnouncementPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [city, setCity] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [subcategories, setSubcategories] = useState<CategoryDto["subcategories"]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        getCategories()
            .then((dtos) => setCategories(dtos))
            .catch((err: unknown) => console.error("Не удалось загрузить категории:", err));
    }, []);

    useEffect(() => {
        const dto = categories.find((c) => c.id === selectedCategory);
        setSubcategories(dto?.subcategories ?? []);
        setSelectedSubcategory("");
    }, [selectedCategory, categories]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        if (!/^[^\d]+$/.test(city)) {
            setMessage({ type: "error", text: "Поле «Город» не должно содержать цифр." });
            setLoading(false);
            return;
        }

        if (!title || !description || !price || !city || !selectedCategory) {
            setMessage({ type: "error", text: "Заполните все обязательные поля." });
            setLoading(false);
            return;
        }

        const payload: AddAnnouncementRequest = {
            title,
            description,
            price,
            city,
            count: 1,
            subcategoryId: selectedSubcategory || subcategories[0]?.id || "",
            images: [],
        };

        try {
            const newAnn = await addAnnouncement(payload);
            router.push(`/announcements/${newAnn.id}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.message.includes("Invalid JSON response")) {
                    router.push("/profile");
                    return;
                }
                console.error("Ошибка создания объявления:", err.message);
            } else {
                console.error("Ошибка создания объявления (не Error):", err);
            }

            setMessage({ type: "error", text: "Не удалось создать объявление." });
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Подать новое объявление</h1>

            {message && (
                <p className={`${styles.message} ${message.type === "success" ? styles.success : styles.error}`}>
                    {message.text}
                </p>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Заголовок */}
                <div className={styles.formGroup}>
                    <label htmlFor="title" className={styles.label}>Заголовок *</label>
                    <input
                        id="title"
                        className={styles.input}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={100}
                    />
                </div>

                {/* Описание */}
                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.label}>Описание *</label>
                    <textarea
                        id="description"
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        maxLength={1000}
                        rows={5}
                    />
                </div>

                {/* Категория */}
                <div className={styles.formGroup}>
                    <label htmlFor="category" className={styles.label}>Категория *</label>
                    <select
                        id="category"
                        className={styles.select}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        required
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Подкатегория */}
                {subcategories.length > 0 && (
                    <div className={styles.formGroup}>
                        <label htmlFor="subcategory" className={styles.label}>Подкатегория</label>
                        <select
                            id="subcategory"
                            className={styles.select}
                            value={selectedSubcategory}
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                        >
                            <option value="">Не выбрано</option>
                            {subcategories.map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Цена */}
                <div className={styles.formGroup}>
                    <label htmlFor="price" className={styles.label}>Цена (₽) *</label>
                    <input
                        id="price"
                        className={styles.input}
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(+e.target.value)}
                        required
                        min={0}
                        step="0.01"
                    />
                </div>

                {/* Город */}
                <div className={styles.formGroup}>
                    <label htmlFor="city" className={styles.label}>Город *</label>
                    <input
                        id="city"
                        className={styles.input}
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        maxLength={50}
                        pattern="[^\d]+"
                        title="Город не должен содержать цифр"
                    />
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? "Публикация..." : "Опубликовать объявление"}
                </button>
            </form>
        </div>
    );
}
