import React from 'react';
import { mockCategories, mockSubcategories } from '@/lib/mockData';
import styles from './CategoriesPage.module.scss';

const CategoriesPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Все категории объявлений</h1>
      <div className={styles.categoryList}>
        {mockCategories.map(category => (
          <div key={category.id} className={styles.categoryItem}>
            <h2>{category.name}</h2>
            <ul className={styles.subcategoryList}>
              {mockSubcategories
                .filter(sub => sub.categoryId === category.id)
                .map(sub => (
                  <li key={sub.id}>
                    <a href={`/search?q=${encodeURIComponent(sub.name)}`}>{sub.name}</a>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
