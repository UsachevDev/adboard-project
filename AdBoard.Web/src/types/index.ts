export type UUID = string; // Или number, если UUID на бэке будет числом, но обычно это строка

export interface User {
    id: UUID;
    email: string;
    password?: string; // Пароль не будем получать на фронт, но для формы регистрации он нужен
    createdAt: string; // ISO Date string
}

export interface Announcement {
    id: UUID;
    creatorId: UUID;
    title: string;
    description: string;
    price: number; // DECIMAL
    city: string;
    count: number; // INTEGER (количество просмотров)
    images?: string[]; // Array of image URLs
    categories?: Category[]; // Для связи Many-to-Many
    subcategories?: Subcategory[]; // Для связи Many-to-Many
    createdAt: string;
}

export interface Favourite {
    userId: UUID;
    announcementId: UUID;
}

export interface Review {
    id: UUID;
    buyerId: UUID;
    sellerId: UUID;
    score: number; // INTEGER (от 1 до 5)
    description: string;
    announcementId: UUID;
}

export interface Category {
    id: UUID;
    name: string;
}

export interface Subcategory {
    id: UUID;
    name: string;
    categoryId: UUID; // Связь с категорией
}

// Интерфейсы для заглушек, если нужно будет расширить данные для отображения
export interface AnnouncementWithDetails extends Announcement {
    creator?: User; // Для отображения информации о создателе
    reviews?: Review[]; // Отзывы к объявлению
}

export interface UserProfile extends User {
    announcements?: Announcement[]; // Объявления пользователя
    favourites?: Announcement[]; // Избранные объявления пользователя
    reviewsGiven?: Review[]; // Отзывы, оставленные пользователем
    reviewsReceived?: Review[]; // Отзывы, полученные пользователем
}
