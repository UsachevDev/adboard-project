export type UUID = string;

export interface User {
    id: UUID;
    email: string;
    password?: string;
    createdAt: string; // ISO Date string
    name?: string;
    phoneNumber?: string | null;
    city?: string | null;
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
    categories?: Category[]; // Array of Category objects
    subcategories?: Subcategory[]; // Array of Subcategory objects
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
    image?: string;
}

export interface Subcategory {
    id: UUID;
    name: string;
    categoryId: UUID; // Связь с категорией
    image?: string;
}

// Интерфейсы для заглушек
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
