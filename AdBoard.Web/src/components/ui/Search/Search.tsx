'use client';

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Search.module.scss';
import { mockCategories, mockSubcategories } from '@/lib/mockData';
import { Category, Subcategory } from '@/types';

interface SearchSuggestion {
  type: 'category' | 'subcategory' | 'common_phrase';
  value: string;
  id?: string;
}

const generateAllSuggestions = (): SearchSuggestion[] => {
  const suggestions: SearchSuggestion[] = [];

  mockCategories.forEach(cat => {
    suggestions.push({ type: 'category', value: cat.name, id: cat.id });
  });

  mockSubcategories.forEach(subcat => {
    suggestions.push({ type: 'subcategory', value: subcat.name, id: subcat.id });
  });

  const commonPhrases: string[] = [
    'Купить квартиру', 'Арендовать дом', 'Продать авто', 'Ремонт ноутбуков',
    'Продать iPhone', 'Купить электронику', 'Обмен авто', 'Мотоциклы купить', 'Купить BMW', 'Ремонт iPhone'
  ];
  commonPhrases.forEach(phrase => {
    suggestions.push({ type: 'common_phrase', value: phrase });
  });

  const uniqueSuggestionsMap = new Map<string, SearchSuggestion>();
  suggestions.forEach(s => {
    if (!uniqueSuggestionsMap.has(s.value.toLowerCase())) {
      uniqueSuggestionsMap.set(s.value.toLowerCase(), s);
    }
  });

  return Array.from(uniqueSuggestionsMap.values());
};

const ALL_SEARCH_SUGGESTIONS = generateAllSuggestions();

const Search: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isCategoriesPanelOpen, setIsCategoriesPanelOpen] = useState<boolean>(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith('/search')) {
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      const currentQuery = new URLSearchParams(window.location.search).get('q') || '';
      const currentCategoryId = new URLSearchParams(window.location.search).get('categoryId') || '';
      const currentSubcategoryId = new URLSearchParams(window.location.search).get('subcategoryId') || '';

      if (currentCategoryId) {
        const category = mockCategories.find(c => c.id === currentCategoryId);
        setQuery(category ? category.name : '');
      } else if (currentSubcategoryId) {
        const subcategory = mockSubcategories.find(s => s.id === currentSubcategoryId);
        setQuery(subcategory ? subcategory.name : '');
      } else {
        setQuery(currentQuery);
      }
    }
    setIsCategoriesPanelOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim().length > 1) {
        const filtered = ALL_SEARCH_SUGGESTIONS.filter(suggestion =>
          suggestion.value.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 7);
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else if (query.trim().length === 0) {
        setSuggestions(ALL_SEARCH_SUGGESTIONS.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }

      if (isCategoriesPanelOpen) {
        const panelElement = document.querySelector(`.${styles.categoriesPanel}`);
        const buttonElement = document.querySelector(`.${styles.browseCategoriesButton}`);

        if (panelElement && !panelElement.contains(event.target as Node) &&
          buttonElement && !buttonElement.contains(event.target as Node)) {
          setIsCategoriesPanelOpen(false);
          document.body.style.overflow = '';
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoriesPanelOpen]);

  useEffect(() => {
    if (isCategoriesPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCategoriesPanelOpen]);


  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setIsCategoriesPanelOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.value);
    let url = `/search?q=${encodeURIComponent(suggestion.value.trim())}`;
    if (suggestion.type === 'category' && suggestion.id) {
      url = `/search?categoryId=${encodeURIComponent(suggestion.id)}&q=${encodeURIComponent(suggestion.value.trim())}`;
    } else if (suggestion.type === 'subcategory' && suggestion.id) {
      url = `/search?subcategoryId=${encodeURIComponent(suggestion.id)}&q=${encodeURIComponent(suggestion.value.trim())}`;
    }
    router.push(url);
    setShowSuggestions(false);
    setIsCategoriesPanelOpen(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };


  const handleInputFocus = () => {
    if (query.trim().length > 1 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (query.trim().length === 0 && ALL_SEARCH_SUGGESTIONS.length > 0) {
      setSuggestions(ALL_SEARCH_SUGGESTIONS.slice(0, 5));
      setShowSuggestions(true);
    }
    setIsCategoriesPanelOpen(false);
  };

  const handleToggleCategoriesPanel = () => {
    setIsCategoriesPanelOpen(prevState => !prevState);
    setShowSuggestions(false);
    if (!isCategoriesPanelOpen && mockCategories.length > 0) {
      setActiveCategoryId(mockCategories[0].id);
    } else {
      setActiveCategoryId(null);
    }
  };

  const handleCategoryOrSubcategorySelect = (item: Category | Subcategory, type: 'category' | 'subcategory') => {
    setQuery(item.name);
    let url = `/search?q=${encodeURIComponent(item.name.trim())}`;
    if (type === 'category') {
      url = `/search?categoryId=${encodeURIComponent(item.id)}&q=${encodeURIComponent(item.name.trim())}`;
    } else if (type === 'subcategory') {
      url = `/search?subcategoryId=${encodeURIComponent(item.id)}&q=${encodeURIComponent(item.name.trim())}`;
    }
    router.push(url);
    setIsCategoriesPanelOpen(false);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const panelTopPosition = searchWrapperRef.current
    ? searchWrapperRef.current.offsetTop + searchWrapperRef.current.offsetHeight
    : 0;

  const filteredSubcategories = activeCategoryId
    ? mockSubcategories.filter(sub => sub.categoryId === activeCategoryId)
    : [];

  return (
    <div className={styles.searchWrapper} ref={searchWrapperRef}>
      <div className={styles.container}>
        <div className={styles.searchControls}>
          <button
            type="button"
            className={styles.browseCategoriesButton}
            onClick={handleToggleCategoriesPanel}
          >
            Все категории
          </button>

          <div className={styles.inputAndSuggestions}>
            <form onSubmit={handleSubmit} className={styles.searchForm}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Искать объявления..."
                className={styles.searchInput}
                autoComplete="off"
                aria-label="Search announcements"
                ref={searchInputRef}
              />
              <button type="submit" className={styles.searchButton}>
                Поиск
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {isCategoriesPanelOpen && (
        <>
          <div
            className={styles.categoriesOverlay}
            onClick={() => setIsCategoriesPanelOpen(false)}
            style={{ top: `${panelTopPosition}px`, height: `calc(100vh - ${panelTopPosition}px)` }}
          />

          <div className={styles.categoriesPanel} style={{ top: `${panelTopPosition}px` }}>
            <div className={styles.categoriesPanelContent}>
              <div className={styles.mainAndSubcategoriesContainer}>
                <ul className={styles.mainCategoriesList}>
                  {mockCategories.map(category => (
                    <li
                      key={category.id}
                      className={`${styles.mainCategoryItem} ${activeCategoryId === category.id ? styles.active : ''}`}
                      onMouseEnter={() => setActiveCategoryId(category.id)}
                      onClick={() => handleCategoryOrSubcategorySelect(category, 'category')}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>

                <div className={styles.subcategoriesDisplay}>
                  {activeCategoryId ? (
                    <>
                      <h3 className={styles.subcategoriesTitle}>
                        {mockCategories.find(cat => cat.id === activeCategoryId)?.name}
                      </h3>
                      <ul className={styles.subcategoriesListGrid}>
                        {filteredSubcategories.map(sub => (
                          <li key={sub.id}>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleCategoryOrSubcategorySelect(sub, 'subcategory'); }}>
                              {sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className={styles.selectCategoryMessage}>Наведите на категорию слева</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
