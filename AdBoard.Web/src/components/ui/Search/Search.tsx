"use client";

import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
    FormEvent,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import styles from "./Search.module.scss";
import { getCategories, CategoryDto } from "@/lib/api";
import { Category, Subcategory } from "@/types";

interface SearchSuggestion {
    type: "category" | "subcategory" | "common_phrase";
    value: string;
    id?: string;
}

const commonPhrases: string[] = [
    "Купить квартиру",
    "Арендовать дом",
    "Продать авто",
    "Ремонт ноутбуков",
    "Продать iPhone",
    "Купить электронику",
    "Обмен авто",
    "Мотоциклы купить",
    "Купить BMW",
    "Ремонт iPhone",
];

const mapCategory = (dto: CategoryDto): Category => ({
    id: dto.id,
    name: dto.name,
    subcategories: dto.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        categoryId: dto.id,
    })),
});

const Search: React.FC = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isCategoriesPanelOpen, setIsCategoriesPanelOpen] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
        null
    );
    const [justNavigated, setJustNavigated] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        getCategories()
            .then((dtos: CategoryDto[]) => {
                const cats = dtos.map(mapCategory);
                setCategories(cats);

                setSubcategories(
                    cats.flatMap((c) =>
                        c.subcategories ? c.subcategories : []
                    )
                );
            })
            .catch((err) =>
                console.error("Ошибка при загрузке категорий:", err)
            );
    }, []);

    const ALL_SUGGESTIONS = useMemo<SearchSuggestion[]>(() => {
        const arr: SearchSuggestion[] = [];
        categories.forEach((c) =>
            arr.push({ type: "category", value: c.name, id: c.id })
        );
        subcategories.forEach((s) =>
            arr.push({ type: "subcategory", value: s.name, id: s.id })
        );
        commonPhrases.forEach((p) =>
            arr.push({ type: "common_phrase", value: p })
        );
        const map = new Map<string, SearchSuggestion>();
        arr.forEach((s) => {
            const key = s.value.toLowerCase();
            if (!map.has(key)) map.set(key, s);
        });
        return Array.from(map.values());
    }, [categories, subcategories]);

    useEffect(() => {
        const q = searchParams.get("q") ?? "";
        const cid = searchParams.get("categoryId");
        const sid = searchParams.get("subcategoryId");

        if (cid) {
            const c = categories.find((c) => c.id === cid);
            setQuery(c ? c.name : "");
        } else if (sid) {
            const s = subcategories.find((s) => s.id === sid);
            setQuery(s ? s.name : "");
        } else {
            setQuery(q);
        }
        setShowSuggestions(false);
        setIsCategoriesPanelOpen(false);
        setJustNavigated(false);
    }, [pathname, searchParams, categories, subcategories]);

    useEffect(() => {
        if (justNavigated) {
            setJustNavigated(false);
            setShowSuggestions(false);
            return;
        }
        const trimmed = query.trim().toLowerCase();
        const timer = setTimeout(() => {
            if (trimmed === "") {
                setSuggestions(ALL_SUGGESTIONS.slice(0, 5));
            } else {
                setSuggestions(
                    ALL_SUGGESTIONS.filter((s) =>
                        s.value.toLowerCase().includes(trimmed)
                    ).slice(0, 7)
                );
            }
            setShowSuggestions(true);
            setIsCategoriesPanelOpen(false);
        }, 200);
        return () => clearTimeout(timer);
    }, [query, justNavigated, ALL_SUGGESTIONS]);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setShowSuggestions(false);
                setIsCategoriesPanelOpen(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isCategoriesPanelOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isCategoriesPanelOpen]);

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            const t = query.trim();
            if (t) {
                setJustNavigated(true);
                router.push(`/search?q=${encodeURIComponent(t)}`);
                setShowSuggestions(false);
            }
        },
        [query, router]
    );

    const handleSuggestionClick = useCallback(
        (s: SearchSuggestion) => {
            setQuery(s.value);
            let url = `/search?q=${encodeURIComponent(s.value.trim())}`;
            if (s.type === "category" && s.id) {
                url = `/search?categoryId=${encodeURIComponent(s.id)}`;
            } else if (s.type === "subcategory" && s.id) {
                url = `/search?subcategoryId=${encodeURIComponent(s.id)}`;
            }
            setJustNavigated(true);
            router.push(url);
            setShowSuggestions(false);
        },
        [router]
    );

    const handleInputFocus = useCallback(() => {
        const trimmed = query.trim().toLowerCase();
        if (trimmed === "") {
            setSuggestions(ALL_SUGGESTIONS.slice(0, 5));
        } else {
            setSuggestions(
                ALL_SUGGESTIONS.filter((s) =>
                    s.value.toLowerCase().includes(trimmed)
                ).slice(0, 7)
            );
        }
        setShowSuggestions(true);
        setIsCategoriesPanelOpen(false);
    }, [ALL_SUGGESTIONS, query]);

    const handleToggleCategoriesPanel = useCallback(() => {
        setIsCategoriesPanelOpen((prev) => {
            const next = !prev;
            if (next && categories.length) {
                setActiveCategoryId(categories[0].id);
                setShowSuggestions(false);
            } else {
                setActiveCategoryId(null);
            }
            return next;
        });
    }, [categories]);

    const handleCategoryOrSubcategorySelect = useCallback(
        (item: Category | Subcategory, type: "category" | "subcategory") => {
            setQuery(item.name);
            let url = `/search?q=${encodeURIComponent(item.name.trim())}`;
            if (type === "category") {
                url = `/search?categoryId=${encodeURIComponent(item.id)}`;
            } else {
                url = `/search?subcategoryId=${encodeURIComponent(item.id)}`;
            }
            setJustNavigated(true);
            router.push(url);
            setShowSuggestions(false);
            setIsCategoriesPanelOpen(false);
        },
        [router]
    );

    const filteredSubcategories = useMemo<Subcategory[]>(
        () =>
            activeCategoryId
                ? subcategories.filter((s) => s.categoryId === activeCategoryId)
                : [],
        [activeCategoryId, subcategories]
    );

    const panelTop = useMemo(() => {
        const el = wrapperRef.current;
        return el ? el.offsetTop + el.offsetHeight : 0;
    }, []);

    return (
        <div className={styles.searchWrapper} ref={wrapperRef}>
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
                        <form
                            onSubmit={handleSubmit}
                            className={styles.searchForm}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={handleInputFocus}
                                placeholder="Искать объявления..."
                                className={styles.searchInput}
                                autoComplete="off"
                                aria-label="Search announcements"
                            />
                            <button
                                type="submit"
                                className={styles.searchButton}
                            >
                                Поиск
                            </button>
                        </form>
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className={styles.suggestionsList}>
                                {suggestions.map((s, idx) => (
                                    <li
                                        key={idx}
                                        className={styles.suggestionItem}
                                        onClick={() => handleSuggestionClick(s)}
                                    >
                                        {s.value}
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
                        style={{
                            top: panelTop,
                            height: `calc(100vh - ${panelTop}px)`,
                        }}
                    />
                    <div
                        className={styles.categoriesPanel}
                        style={{ top: panelTop }}
                    >
                        <div className={styles.categoriesPanelContent}>
                            <div
                                className={styles.mainAndSubcategoriesContainer}
                            >
                                <ul className={styles.mainCategoriesList}>
                                    {categories.map((cat) => (
                                        <li
                                            key={cat.id}
                                            className={`${
                                                styles.mainCategoryItem
                                            } ${
                                                activeCategoryId === cat.id
                                                    ? styles.active
                                                    : ""
                                            }`}
                                            onMouseEnter={() =>
                                                setActiveCategoryId(cat.id)
                                            }
                                            onClick={() =>
                                                handleCategoryOrSubcategorySelect(
                                                    cat,
                                                    "category"
                                                )
                                            }
                                        >
                                            {cat.name}
                                        </li>
                                    ))}
                                </ul>
                                <div className={styles.subcategoriesDisplay}>
                                    {filteredSubcategories.length > 0 ? (
                                        <>
                                            <h3
                                                className={
                                                    styles.subcategoriesTitle
                                                }
                                            >
                                                {
                                                    categories.find(
                                                        (c) =>
                                                            c.id ===
                                                            activeCategoryId
                                                    )?.name
                                                }
                                            </h3>
                                            <ul
                                                className={
                                                    styles.subcategoriesListGrid
                                                }
                                            >
                                                {filteredSubcategories.map(
                                                    (sub) => (
                                                        <li key={sub.id}>
                                                            <a
                                                                href="#"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    handleCategoryOrSubcategorySelect(
                                                                        sub,
                                                                        "subcategory"
                                                                    );
                                                                }}
                                                            >
                                                                {sub.name}
                                                            </a>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </>
                                    ) : (
                                        <p
                                            className={
                                                styles.selectCategoryMessage
                                            }
                                        >
                                            Наведите на категорию слева
                                        </p>
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
