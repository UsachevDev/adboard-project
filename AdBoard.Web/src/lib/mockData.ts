import { Announcement, Category, Subcategory, User, Review } from "../types";

export const mockUsers: User[] = [
    {
        id: "user-1-uuid",
        email: "user1@example.com",
        createdAt: "2023-01-15T10:00:00Z",
    },
    {
        id: "user-2-uuid",
        email: "user2@example.com",
        createdAt: "2023-02-20T11:30:00Z",
    },
    {
        id: "user-3-uuid",
        email: "user3@example.com",
        createdAt: "2023-03-01T09:15:00Z",
    },
];

export const mockCategories: Category[] = [
    { id: "cat-1-uuid", name: "Электроника" },
    { id: "cat-2-uuid", name: "Недвижимость" },
    { id: "cat-3-uuid", name: "Транспорт" },
    { id: "cat-4-uuid", name: "Одежда" },
];

export const mockSubcategories: Subcategory[] = [
    { id: "subcat-1-uuid", name: "Смартфоны", categoryId: "cat-1-uuid" },
    { id: "subcat-2-uuid", name: "Ноутбуки", categoryId: "cat-1-uuid" },
    { id: "subcat-3-uuid", name: "Квартиры", categoryId: "cat-2-uuid" },
    { id: "subcat-4-uuid", name: "Дома", categoryId: "cat-2-uuid" },
    {
        id: "subcat-5-uuid",
        name: "Легковые автомобили",
        categoryId: "cat-3-uuid",
    },
    { id: "subcat-6-uuid", name: "Мотоциклы", categoryId: "cat-3-uuid" },
];

export const mockAnnouncements: Announcement[] = [
    {
        id: "ann-1-uuid",
        creatorId: "user-1-uuid",
        title: "Продам iPhone 13 Pro Max",
        description: "Состояние отличное, почти новый. Куплен год назад.",
        price: 85000.0,
        city: "Москва",
        count: 120,
        images: ["/iphone-13.jpg", "/iphone-13-2.jpg"], // Пути к изображениям в public/
        categories: [mockCategories[0]], // Электроника
        subcategories: [mockSubcategories[0]], // Смартфоны
    },
    {
        id: "ann-2-uuid",
        creatorId: "user-2-uuid",
        title: "Сдам 1-комнатную квартиру",
        description: "Уютная квартира в центре города, рядом метро.",
        price: 35000.0,
        city: "Санкт-Петербург",
        count: 250,
        images: ["/flat-1.jpg", "/flat-2.jpg"],
        categories: [mockCategories[1]], // Недвижимость
        subcategories: [mockSubcategories[2]], // Квартиры
    },
    {
        id: "ann-3-uuid",
        creatorId: "user-1-uuid",
        title: "Продам Macbook Pro 2020",
        description: "В идеальном состоянии, для работы и учебы.",
        price: 120000.0,
        city: "Москва",
        count: 80,
        images: ["/macbook.jpg"],
        categories: [mockCategories[0]], // Электроника
        subcategories: [mockSubcategories[1]], // Ноутбуки
    },
    {
        id: "ann-4-uuid",
        creatorId: "user-3-uuid",
        title: "BMW X5 2018",
        description: "Полная комплектация, один владелец, без ДТП.",
        price: 3500000.0,
        city: "Казань",
        count: 300,
        images: ["/bmw-x5.jpg"],
        categories: [mockCategories[2]], // Транспорт
        subcategories: [mockSubcategories[4]], // Легковые автомобили
    },
];

export const mockReviews: Review[] = [
    {
        id: "rev-1-uuid",
        buyerId: "user-2-uuid",
        sellerId: "user-1-uuid",
        score: 5,
        description: "Отличный продавец, всё быстро и четко!",
        announcementId: "ann-1-uuid",
    },
    {
        id: "rev-2-uuid",
        buyerId: "user-1-uuid",
        sellerId: "user-2-uuid",
        score: 4,
        description: "Квартира соответствует описанию, хозяин приветливый.",
        announcementId: "ann-2-uuid",
    },
];
