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

export interface AddAnnouncementRequest {
    title: string;
    description: string;
    price: number;
    city: string;
    count: number;
    subcategoryId: string;
    images?: string[];
}

export interface Announcement {
    id: UUID;
    creatorId: UUID;
    title: string;
    description: string;
    price: number;
    city: string;
    count: number;
    images?: string[];
    categories?: Category[];
    subcategories?: Subcategory[];
    createdAt: string;
    isFavorite?: boolean;
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
    subcategories?: Subcategory[];
}

export interface Subcategory {
    id: UUID;
    name: string;
    categoryId: UUID;
    image?: string;
}

// Интерфейсы для заглушек
export interface AnnouncementWithDetails extends Announcement {
    creator?: User; // Для отображения информации о создателе
    reviews?: Review[]; // Отзывы к объявлению
}

export interface UserProfile extends User {
    announcements?: Announcement[];
    favourites?: Announcement[];
    reviewsGiven?: Review[];      // Оставленные отзывы
    reviewsReceived?: Review[];   // Полученные отзывы  // Отзывы, полученные пользователем
    reviews?: Review[]; 
}
