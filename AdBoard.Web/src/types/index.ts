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

export interface UpdateAnnouncementRequest {
  title?: string;
  description?: string;
  price?: number;
  city?: string;
  count?: number;
  isHidden?: boolean;
}

export interface Announcement {
    id: UUID;
    creatorId: UUID;
    title: string;
    description: string;
    price: number;
    city: string;
    count: number;
    subcategoryId: UUID;
    images?: string[];
    category?: Category;
    subcategory?: Subcategory;
    createdAt: string;
    isFavorite?: boolean;
    isHidden: boolean;
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
    category: Category;
    image?: string;
}

export interface AnnouncementWithDetails extends Announcement {
    creator?: User; // Для отображения информации о создателе
    reviews?: Review[]; // Отзывы к объявлению
}

export interface UserProfile extends User {
    announcements?: Announcement[];
    favorites?: Announcement[];
    reviewsGiven?: Review[];      // Оставленные отзывы
    reviewsReceived?: Review[];   // Полученные отзывы  // Отзывы, полученные пользователем
    reviews?: Review[]; 
}
