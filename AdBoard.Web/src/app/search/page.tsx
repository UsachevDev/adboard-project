'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './SearchPage.module.scss';
import { Announcement } from '@/types';
import AnnouncementCard from '@/components/ui/AnnouncementCard/AnnouncementCard';
import { mockAnnouncements } from '@/lib/mockData';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const categoryId = searchParams.get('categoryId');
  const subcategoryId = searchParams.get('subcategoryId');

  const [results, setResults] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered: Announcement[] = [];

      if (categoryId) {
        filtered = mockAnnouncements.filter(announcement =>
          announcement.categories && announcement.categories.some(cat => cat.id === categoryId)
        );
      } else if (subcategoryId) {
        filtered = mockAnnouncements.filter(announcement =>
          announcement.subcategories && announcement.subcategories.some(sub => sub.id === subcategoryId)
        );
      } else if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();

        filtered = mockAnnouncements.filter(announcement => {
          const matchesTitle = announcement.title.toLowerCase().includes(lowerCaseQuery);
          const matchesDescription = announcement.description.toLowerCase().includes(lowerCaseQuery);
          const matchesCity = announcement.city.toLowerCase().includes(lowerCaseQuery);

          const matchesCategoryPartially = announcement.categories
            ? announcement.categories.some(category =>
                category.name.toLowerCase().includes(lowerCaseQuery)
              )
            : false;

          const matchesSubcategoryPartially = announcement.subcategories
            ? announcement.subcategories.some(subcategory =>
                subcategory.name.toLowerCase().includes(lowerCaseQuery)
              )
            : false;

          let isBuySellQuery = false;
          let keywordFromPhrase = '';
          if (lowerCaseQuery.startsWith('купить ') || lowerCaseQuery.startsWith('продать ')) {
            isBuySellQuery = true;
            keywordFromPhrase = lowerCaseQuery.split(' ').slice(1).join(' ');
          }

          const matchesKeywordInBuySellPhrase = keywordFromPhrase ?
            (announcement.title.toLowerCase().includes(keywordFromPhrase) ||
             announcement.description.toLowerCase().includes(keywordFromPhrase) ||
             (announcement.categories && announcement.categories.some(c => c.name.toLowerCase().includes(keywordFromPhrase))) ||
             (announcement.subcategories && announcement.subcategories.some(s => s.name.toLowerCase().includes(keywordFromPhrase))))
            : false;

          return matchesTitle || matchesDescription || matchesCity ||
                 matchesCategoryPartially || matchesSubcategoryPartially ||
                 (isBuySellQuery && matchesKeywordInBuySellPhrase);
        });
      }
      setResults(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, categoryId, subcategoryId]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {searchQuery ? `Результаты поиска для: "${searchQuery}"` : 'Введите запрос для поиска'}
      </h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : results.length > 0 ? (
        <div className={styles.resultsGrid}>
          {results.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      ) : (
        <p>По вашему запросу ничего не найдено.</p>
      )}
    </div>
  );
};

export default SearchPage;
