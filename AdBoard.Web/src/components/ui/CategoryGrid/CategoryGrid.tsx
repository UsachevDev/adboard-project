'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CategoryGrid.module.scss';
import { Category, Subcategory } from '@/types';

interface CategoryGridProps {
    items: (Category | Subcategory)[];
    basePath: string;
    isCategoryGrid?: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ items, basePath, isCategoryGrid = false }) => {
    return (
        <div className={styles.gridContainer}>
            {items.map((item) => {
                const isCategory = 'subcategories' in item;
                let href = '';

                if (isCategoryGrid) {
                    href = `${basePath}?categoryId=${item.id}`;
                } else {
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
                                    objectFit="contain"
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
