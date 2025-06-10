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
    { id: 'cat1', name: 'Недвижимость' },
    { id: 'cat2', name: 'Транспорт' },
    { id: 'cat3', name: 'Работа' },
    { id: 'cat4', name: 'Электроника' },
    { id: 'cat5', name: 'Личные вещи' },
    { id: 'cat6', name: 'Для дома и дачи' },
    { id: 'cat7', name: 'Услуги' },
    { id: 'cat8', name: 'Хобби и отдых' },
    { id: 'cat9', name: 'Животные' },
    { id: 'cat10', name: 'Для бизнеса' },
];

export const mockSubcategories: Subcategory[] = [
    // Недвижимость
    { id: 'sub1_1', categoryId: 'cat1', name: 'Квартиры' },
    { id: 'sub1_2', categoryId: 'cat1', name: 'Комнаты' },
    { id: 'sub1_3', categoryId: 'cat1', name: 'Дома, дачи, коттеджи' },
    { id: 'sub1_4', categoryId: 'cat1', name: 'Земельные участки' },
    { id: 'sub1_5', categoryId: 'cat1', name: 'Гаражи и машиноместа' },
    { id: 'sub1_6', categoryId: 'cat1', name: 'Коммерческая недвижимость' },
    { id: 'sub1_7', categoryId: 'cat1', name: 'Недвижимость за рубежом' },

    // Транспорт
    { id: 'sub2_1', categoryId: 'cat2', name: 'Автомобили' },
    { id: 'sub2_2', categoryId: 'cat2', name: 'Мотоциклы и мототехника' },
    { id: 'sub2_3', categoryId: 'cat2', name: 'Грузовики и спецтехника' },
    { id: 'sub2_4', categoryId: 'cat2', name: 'Водный транспорт' },
    { id: 'sub2_5', categoryId: 'cat2', name: 'Запчасти и аксессуары' },

    // Работа
    { id: 'sub3_1', categoryId: 'cat3', name: 'Вакансии' },
    { id: 'sub3_2', categoryId: 'cat3', name: 'Резюме' },

    // Электроника
    { id: 'sub4_1', categoryId: 'cat4', name: 'Телефоны' },
    { id: 'sub4_2', categoryId: 'cat4', name: 'Компьютеры' },
    { id: 'sub4_3', categoryId: 'cat4', name: 'Ноутбуки' },
    { id: 'sub4_4', categoryId: 'cat4', name: 'Планшеты и электронные книги' },
    { id: 'sub4_5', categoryId: 'cat4', name: 'Фото- и видеокамеры' },
    { id: 'sub4_6', categoryId: 'cat4', name: 'Аудио и видео' },
    { id: 'sub4_7', categoryId: 'cat4', name: 'Игры, приставки и программы' },
    { id: 'sub4_8', categoryId: 'cat4', name: 'Настольные компьютеры' },

    // Личные вещи
    { id: 'sub5_1', categoryId: 'cat5', name: 'Одежда, обувь, аксессуары' },
    { id: 'sub5_2', categoryId: 'cat5', name: 'Детская одежда и обувь' },
    { id: 'sub5_3', categoryId: 'cat5', name: 'Товары для детей и игрушки' },
    { id: 'sub5_4', categoryId: 'cat5', name: 'Красота и здоровье' },
    { id: 'sub5_5', categoryId: 'cat5', name: 'Часы и украшения' },

    // Для дома и дачи
    { id: 'sub6_1', categoryId: 'cat6', name: 'Мебель и интерьер' },
    { id: 'sub6_2', categoryId: 'cat6', name: 'Посуда и товары для кухни' },
    { id: 'sub6_3', categoryId: 'cat6', name: 'Ремонт и строительство' },
    { id: 'sub6_4', categoryId: 'cat6', name: 'Бытовая техника' },
    { id: 'sub6_5', categoryId: 'cat6', name: 'Растения' },

    // Услуги (cat7)
    { id: 'sub7_1', categoryId: 'cat7', name: 'Предложение услуг' },
    { id: 'sub7_2', categoryId: 'cat7', name: 'Деловые услуги' },
    { id: 'sub7_3', categoryId: 'cat7', name: 'Обучение, курсы' },

    // Хобби и отдых
    { id: 'sub8_1', categoryId: 'cat8', name: 'Билеты и путешествия' },
    { id: 'sub8_2', categoryId: 'cat8', name: 'Спорт и отдых' },
    { id: 'sub8_3', categoryId: 'cat8', name: 'Книги и журналы' },
    { id: 'sub8_4', categoryId: 'cat8', name: 'Коллекционирование' },
    { id: 'sub8_5', categoryId: 'cat8', name: 'Музыкальные инструменты' },

    // Животные
    { id: 'sub9_1', categoryId: 'cat9', name: 'Кошки' },
    { id: 'sub9_2', categoryId: 'cat9', name: 'Собаки' },
    { id: 'sub9_3', categoryId: 'cat9', name: 'Птицы' },
    { id: 'sub9_4', categoryId: 'cat9', name: 'Аквариум' },
    { id: 'sub9_5', categoryId: 'cat9', name: 'Товары для животных' },

    // Для бизнеса
    { id: 'sub10_1', categoryId: 'cat10', name: 'Оборудование для бизнеса' },
    { id: 'sub10_2', categoryId: 'cat10', name: 'Готовый бизнес' },
    { id: 'sub10_3', categoryId: 'cat10', name: 'Франшизы' },
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
        images: ["/iphone-13.jpg", "/iphone-13-2.jpg"],
        categories: [mockCategories.find(c => c.name === 'Электроника')!],
        subcategories: [mockSubcategories.find(s => s.name === 'Телефоны')!],
        createdAt: "2025-03-01T09:15:00Z",
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
        categories: [mockCategories.find(c => c.name === 'Недвижимость')!],
        subcategories: [mockSubcategories.find(s => s.name === 'Квартиры')!],
        createdAt: "2025-04-06T19:45:10Z",
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
        categories: [mockCategories.find(c => c.name === 'Электроника')!],
        subcategories: [mockSubcategories.find(s => s.name === 'Ноутбуки')!],
        createdAt: "2024-12-21T04:05:00Z",
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
        categories: [mockCategories.find(c => c.name === 'Транспорт')!],
        subcategories: [mockSubcategories.find(s => s.name === 'Автомобили')!],
        createdAt: "2025-06-10T09:15:00Z",
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
