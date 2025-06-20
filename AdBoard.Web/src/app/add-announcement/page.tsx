'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AddAnnouncementPage.module.scss';
import {
    mockCategories,
    mockSubcategories,
    addMockAnnouncement,
    mockUsers,
} from '@/lib/mockData';
import { Announcement, Category, Subcategory } from '@/types';

const AddAnnouncementPage: React.FC = () => {
    const router = useRouter();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
    const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            setIsLoggedIn(true);
            // Имитация получения creatorId из токена для mock-данных
            const match = token.match(/fake-jwt-token-for-(\w+)@example.com-/);
            let userEmailFromToken: string | null = null;
            if (match && match[1]) {
                userEmailFromToken = `${match[1]}@example.com`;
            }
            const foundUser = mockUsers.find(user => user.email === userEmailFromToken);
            if (foundUser) {
                setCurrentUserId(foundUser.id);
            } else {
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
            setMessage({ type: 'error', text: 'Для подачи объявления необходимо войти в систему.' });
        }
    }, []);

    // Обновляем доступные подкатегории при изменении выбранной категории
    useEffect(() => {
        if (selectedCategory) {
            setAvailableSubcategories(mockSubcategories.filter(sub => sub.categoryId === selectedCategory));
            setSelectedSubcategory('');
        } else {
            setAvailableSubcategories([]);
            setSelectedSubcategory('');
        }
    }, [selectedCategory]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImages(prev => [...prev, ...filesArray]);

            const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
            setPreviewImages(prev => [...prev, ...newPreviewUrls]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!isLoggedIn || !currentUserId) {
            setMessage({ type: 'error', text: 'Вы не авторизованы или не удалось определить пользователя.' });
            setLoading(false);
            return;
        }

        if (!title || !description || !price || !city || !selectedCategory) {
            setMessage({ type: 'error', text: 'Пожалуйста, заполните все обязательные поля.' });
            setLoading(false);
            return;
        }

        // Имитация задержки сети
        await new Promise(res => setTimeout(res, 2000));

        // Имитация создания нового объявления
        const newAnnouncement: Announcement = {
            id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Уникальный ID
            creatorId: currentUserId,
            title,
            description,
            price: parseFloat(price),
            city,
            count: 1,
            images: previewImages, // Для имитации, используем URL-ы предпросмотра
            categories: [mockCategories.find(cat => cat.id === selectedCategory)!],
            subcategories: selectedSubcategory ? [mockSubcategories.find(sub => sub.id === selectedSubcategory)!] : [],
            createdAt: new Date().toISOString(),
        };

        addMockAnnouncement(newAnnouncement);
        console.log('Новое объявление:', newAnnouncement);

        setMessage({ type: 'success', text: 'Объявление успешно опубликовано!' });
        setLoading(false);

        // Очистка формы
        setTitle('');
        setDescription('');
        setPrice('');
        setCity('');
        setSelectedCategory('');
        setSelectedSubcategory('');
        setImages([]);
        setPreviewImages([]);

        // Возможно, перенаправление на страницу профиля или главную
        // router.push('/profile'); // или router.push('/');
    };

    if (!isLoggedIn) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Добавить объявление</h1>
                <p className={`${styles.welcomeMessage} ${styles.error}`}>
                    Для подачи объявления необходимо войти в систему.
                </p>
                <p className={styles.loginPrompt}>
                    Пожалуйста, используйте кнопку "Войти" в шапке сайта.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Подать новое объявление</h1>
            {message && (
                <p className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
                    {message.text}
                </p>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title" className={styles.label}>Заголовок объявления *</label>
                    <input
                        type="text"
                        id="title"
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={100}
                    />
                    <small>{title.length}/100</small>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.label}>Описание *</label>
                    <textarea
                        id="description"
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={5}
                        maxLength={1000}
                    ></textarea>
                    <small>{description.length}/1000</small>
                </div>

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
                        {mockCategories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCategory && (
                    <div className={styles.formGroup}>
                        <label htmlFor="subcategory" className={styles.label}>Подкатегория</label>
                        <select
                            id="subcategory"
                            className={styles.select}
                            value={selectedSubcategory}
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                        >
                            <option value="">Выберите подкатегорию (необязательно)</option>
                            {availableSubcategories.map(subcategory => (
                                <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="price" className={styles.label}>Цена (руб.) *</label>
                    <input
                        type="number"
                        id="price"
                        className={styles.input}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Например, 10000"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="city" className={styles.label}>Город *</label>
                    <input
                        type="text"
                        id="city"
                        className={styles.input}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        maxLength={50}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Изображения</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className={styles.fileInput}
                    />
                    <div className={styles.imagePreviews}>
                        {previewImages.map((src, index) => (
                            <div key={index} className={styles.imagePreviewItem}>
                                <img src={src} alt={`Предпросмотр ${index}`} className={styles.imagePreview} />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className={styles.removeImageButton}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <small>Максимум 5 изображений, до 2МБ каждое.</small>
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Публикация...' : 'Опубликовать объявление'}
                </button>
            </form>
        </div>
    );
};

export default AddAnnouncementPage;
