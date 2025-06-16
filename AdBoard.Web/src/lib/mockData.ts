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
    { id: 'cat1', name: 'Недвижимость', image: '/images/cat_realestate.png' },
    { id: 'cat2', name: 'Транспорт', image: '/images/cat_transport.png' },
    { id: 'cat3', name: 'Работа', image: '/images/cat_job.png' },
    { id: 'cat4', name: 'Электроника', image: '/images/cat_electronics.png' },
    { id: 'cat5', name: 'Личные вещи', image: '/images/cat_personal.png' },
    { id: 'cat6', name: 'Для дома и дачи', image: '/images/cat_home_garden.png' },
    { id: 'cat7', name: 'Услуги', image: '/images/cat_services.png' },
    { id: 'cat8', name: 'Хобби и отдых', image: '/images/cat_hobby.png' },
    { id: 'cat9', name: 'Животные', image: '/images/cat_animals.png' },
    { id: 'cat10', name: 'Для бизнеса', image: '/images/cat_business.png' },
];

export const mockSubcategories: Subcategory[] = [
    // Недвижимость
    { id: 'sub1_1', categoryId: 'cat1', name: 'Квартиры', image: '/images/sub_apartments.png' },
    { id: 'sub1_2', categoryId: 'cat1', name: 'Дома, дачи, коттеджи', image: '/images/sub_houses.png' },
    { id: 'sub1_3', categoryId: 'cat1', name: 'Земельные участки', image: '/images/sub_land.png' },
    { id: 'sub1_4', categoryId: 'cat1', name: 'Гаражи и машиноместа', image: '/images/sub_garages.png' },
    { id: 'sub1_5', categoryId: 'cat1', name: 'Коммерческая недвижимость', image: '/images/sub_commercial.png' },

    // Транспорт
    { id: 'sub2_1', categoryId: 'cat2', name: 'Автомобили', image: '/images/sub_cars.png' },
    { id: 'sub2_2', categoryId: 'cat2', name: 'Мотоциклы и мототехника', image: '/images/sub_motorcycles.png' },
    { id: 'sub2_3', categoryId: 'cat2', name: 'Грузовики и спецтехника', image: '/images/sub_trucks.png' },
    { id: 'sub2_4', categoryId: 'cat2', name: 'Водный транспорт', image: '/images/sub_water.png' },
    { id: 'sub2_5', categoryId: 'cat2', name: 'Запчасти и аксессуары', image: '/images/sub_parts.png' },

    // Работа
    { id: 'sub3_1', categoryId: 'cat3', name: 'Вакансии', image: '/images/sub_vacancies.png' },
    { id: 'sub3_2', categoryId: 'cat3', name: 'Резюме', image: '/images/sub_resumes.png' },

    // Электроника
    { id: 'sub4_1', categoryId: 'cat4', name: 'Телефоны', image: '/images/sub_phones.png' },
    { id: 'sub4_2', categoryId: 'cat4', name: 'Компьютеры', image: '/images/sub_computers.png' },
    { id: 'sub4_3', categoryId: 'cat4', name: 'Ноутбуки', image: '/images/sub_laptops.png' },
    { id: 'sub4_4', categoryId: 'cat4', name: 'Планшеты и электронные книги', image: '/images/sub_tablets.png' },
    { id: 'sub4_5', categoryId: 'cat4', name: 'Аудио и видео', image: '/images/sub_audio_video.png' },
    { id: 'sub4_6', categoryId: 'cat4', name: 'Игровые приставки', image: '/images/sub_games.png' },
    { id: 'sub4_7', categoryId: 'cat4', name: 'Бытовая техника', image: '/images/sub_appliances.png' },

    // Личные вещи
    { id: 'sub5_1', categoryId: 'cat5', name: 'Одежда, обувь, аксессуары', image: '/images/sub_clothes.png' },
    { id: 'sub5_2', categoryId: 'cat5', name: 'Детская одежда и обувь', image: '/images/sub_kid_clothes.png' },
    { id: 'sub5_3', categoryId: 'cat5', name: 'Красота и здоровье', image: '/images/sub_beauty_health.png' },
    { id: 'sub5_4', categoryId: 'cat5', name: 'Часы и украшения', image: '/images/sub_jewelry.png' },

    // Для дома и дачи
    { id: 'sub6_1', categoryId: 'cat6', name: 'Мебель и интерьер', image: '/images/sub_furniture.png' },
    { id: 'sub6_2', categoryId: 'cat6', name: 'Посуда и товары для кухни', image: '/images/sub_kitchen.png' },
    { id: 'sub6_3', categoryId: 'cat6', name: 'Ремонт и строительство', image: '/images/sub_renovation.png' },
    { id: 'sub6_4', categoryId: 'cat6', name: 'Растения', image: '/images/sub_plants.png' },

    // Услуги
    { id: 'sub7_1', categoryId: 'cat7', name: 'Предложение услуг', image: '/images/sub_offers.png' },
    { id: 'sub7_2', categoryId: 'cat7', name: 'Деловые услуги', image: '/images/sub_business_services.png' },
    { id: 'sub7_3', categoryId: 'cat7', name: 'Обучение, курсы', image: '/images/sub_courses.png' },

    // Хобби и отдых
    { id: 'sub8_1', categoryId: 'cat8', name: 'Билеты и путешествия', image: '/images/sub_tickets.png' },
    { id: 'sub8_2', categoryId: 'cat8', name: 'Спорт и отдых', image: '/images/sub_sport.png' },
    { id: 'sub8_3', categoryId: 'cat8', name: 'Книги и журналы', image: '/images/sub_books.png' },
    { id: 'sub8_4', categoryId: 'cat8', name: 'Музыкальные инструменты', image: '/images/sub_instruments.png' },

    // Животные
    { id: 'sub9_1', categoryId: 'cat9', name: 'Кошки', image: '/images/sub_cats.png' },
    { id: 'sub9_2', categoryId: 'cat9', name: 'Собаки', image: '/images/sub_dogs.png' },
    { id: 'sub9_3', categoryId: 'cat9', name: 'Птицы', image: '/images/sub_birds.png' },
    { id: 'sub9_4', categoryId: 'cat9', name: 'Аквариум', image: '/images/sub_aquarium.png' },
    { id: 'sub9_5', categoryId: 'cat9', name: 'Товары для животных', image: '/images/sub_pet_supplies.png' },

    // Для бизнеса
    { id: 'sub10_1', categoryId: 'cat10', name: 'Оборудование для бизнеса', image: '/images/sub_equipment.png' },
    { id: 'sub10_2', categoryId: 'cat10', name: 'Готовый бизнес', image: '/images/sub_ready_business.png' },
    { id: 'sub10_3', categoryId: 'cat10', name: 'Франшизы', image: '/images/sub_franchises.png' },
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

const initialAnnouncements: Announcement[] = [
    {
        id: "ann-1-uuid",
        creatorId: "user-1-uuid",
        title: "Продам iPhone 13 Pro Max",
        description: "Состояние отличное, почти новый. Куплен год назад.",
        price: 85000.0,
        city: "Москва",
        count: 120,
        images: ["/iphone-13.jpg", "/iphone-13-2.jpg"],
        categories: [mockCategories.find(c => c.id === 'cat4')!], // 'Электроника' - cat4
        subcategories: [mockSubcategories.find(s => s.id === 'sub4_1')!], // 'Телефоны' - sub4_1
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
        categories: [mockCategories.find(c => c.id === 'cat1')!], // 'Недвижимость' - cat1
        subcategories: [mockSubcategories.find(s => s.id === 'sub1_1')!], // 'Квартиры' - sub1_1
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
        categories: [mockCategories.find(c => c.id === 'cat4')!], // 'Электроника' - cat4
        subcategories: [mockSubcategories.find(s => s.id === 'sub4_3')!], // 'Ноутбуки' - sub4_3
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
        categories: [mockCategories.find(c => c.id === 'cat2')!], // 'Транспорт' - cat2
        subcategories: [mockSubcategories.find(s => s.id === 'sub2_1')!], // 'Автомобили' - sub2_1
        createdAt: "2025-06-10T09:15:00Z",
    },
    {
        id: "ann-5-uuid",
        creatorId: "user-1-uuid",
        title: "Коттедж на берегу озера",
        description: "Шикарный вид, свежий воздух. Идеальное место для отдыха.",
        price: 15000000,
        city: "Сочи",
        count: 50,
        images: ["/flat-1.jpg"], // Используйте существующую картинку как заглушку
        categories: [mockCategories.find(c => c.id === 'cat1')!], // 'Недвижимость' - cat1
        subcategories: [mockSubcategories.find(s => s.id === 'sub1_3')!], // 'Дома, дачи, коттеджи' - sub1_3
        createdAt: "2025-05-20T10:00:00Z",
    },
];

// Функция для загрузки объявлений из localStorage
const LOCAL_STORAGE_KEY = 'adboard_announcements';

const loadAnnouncements = (): Announcement[] => {
    if (typeof window !== 'undefined') {
        const storedAnnouncements = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedAnnouncements) {
            try {
                return JSON.parse(storedAnnouncements);
            } catch (e) {
                console.error("Error parsing stored announcements:", e);
                return initialAnnouncements;
            }
        }
    }
    return initialAnnouncements;
};

// Функция для сохранения объявлений в localStorage
const saveAnnouncements = (announcements: Announcement[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(announcements));
    }
};

// Инициализируем mockAnnouncements при загрузке модуля
export let mockAnnouncements: Announcement[] = loadAnnouncements();

// Убедимся, что initialAnnouncements записаны в localStorage при первом запуске, если они отсутствуют
if (typeof window !== 'undefined' && !localStorage.getItem(LOCAL_STORAGE_KEY)) {
    saveAnnouncements(initialAnnouncements);
}


// Функция для добавления нового объявления
export const addMockAnnouncement = (newAnn: Announcement) => {
    // Вставляем в начало для отображения последних объявлений
    mockAnnouncements.unshift(newAnn);
    saveAnnouncements(mockAnnouncements);
    console.log("Mock Announcement added:", newAnn);
    console.log("Current Mock Announcements:", mockAnnouncements);

    // Вызываем событие storage для оповещения других частей приложения
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
    }
};

export const getMockAnnouncements = (): Announcement[] => {
    // При каждом запросе читаем из localStorage
    return loadAnnouncements();
};
