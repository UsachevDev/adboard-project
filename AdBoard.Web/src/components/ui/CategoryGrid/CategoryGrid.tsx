// src/components/ui/CategoryGrid/CategoryGrid.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // <-- Убедитесь, что Link импортирован
import styles from './CategoryGrid.module.scss';
import { Category, Subcategory } from '@/types'; // Убедитесь, что типы импортированы

interface CategoryGridProps {
    items: (Category | Subcategory)[];
    basePath: string; // /search
    isCategoryGrid?: boolean; // Новый пропс: true для основных категорий, false/undefined для подкатегорий
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ items, basePath, isCategoryGrid = false }) => {
    return (
        <div className={styles.gridContainer}>
            {items.map((item) => {
                const isCategory = 'subcategories' in item; // Простая проверка, является ли элемент Category
                let href = '';

                if (isCategoryGrid) {
                    // Если это сетка основных категорий, ссылка ведет на /search?categoryId=
                    href = `${basePath}?categoryId=${item.id}`;
                } else {
                    // Если это сетка подкатегорий, ссылка ведет на /search?subcategoryId=
                    href = `${basePath}?subcategoryId=${item.id}`;
                }

                return (
                    <Link href={href} key={item.id} className={styles.gridItem}>
                        <div className={styles.imageWrapper}>
                            {item.image && (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    layout="fill"
                                    objectFit="contain" // Используйте "contain" для логотипов/иконок категорий
                                />
                            )}
                        </div>
                        <span className={styles.itemName}>{item.name}</span>
                    </Link>
                );
            })}
        </div>
    );
};

export default CategoryGrid;
