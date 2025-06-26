
-- 1. Недвижимость
INSERT INTO categories (id,name) VALUES
    (gen_random_uuid(), 'Недвижимость');

INSERT INTO subcategories (id,name, category_id) VALUES
                                                  (gen_random_uuid(), 'Квартиры', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  (gen_random_uuid(), 'Комнаты', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  (gen_random_uuid(), 'Дома, дачи, коттеджи', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  (gen_random_uuid(), 'Земельные участки', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  (gen_random_uuid(), 'Гаражи и машиноместа', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  (gen_random_uuid(), 'Коммерческая недвижимость', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  (gen_random_uuid(), 'Недвижимость за рубежом', (SELECT id FROM categories WHERE name = 'Недвижимость'));

-- 2. Транспорт
INSERT INTO categories (id,name) VALUES
    (gen_random_uuid(), 'Транспорт');

INSERT INTO subcategories (id,name, category_id) VALUES
                                                  (gen_random_uuid(), 'Автомобили', (SELECT id FROM categories WHERE name = 'Транспорт')),
                                                  (gen_random_uuid(), 'Мотоциклы и мототехника', (SELECT id FROM categories WHERE name = 'Транспорт')),
                                                  (gen_random_uuid(), 'Грузовики и спецтехника', (SELECT id FROM categories WHERE name = 'Транспорт')),
                                                  (gen_random_uuid(), 'Водный транспорт', (SELECT id FROM categories WHERE name = 'Транспорт')),
                                                  (gen_random_uuid(), 'Запчасти и аксессуары', (SELECT id FROM categories WHERE name = 'Транспорт'));

-- 3. Работа
INSERT INTO categories (id,name) VALUES
    (gen_random_uuid(), 'Работа');

INSERT INTO subcategories (id,name, category_id) VALUES
                                                  (gen_random_uuid(), 'Вакансии', (SELECT id FROM categories WHERE name = 'Работа')),
                                                  (gen_random_uuid(), 'Резюме', (SELECT id FROM categories WHERE name = 'Работа'));

-- 4. Электроника
INSERT INTO categories (id,name) VALUES
    (gen_random_uuid(), 'Электроника');

INSERT INTO subcategories (id,name, category_id) VALUES
                                                  (gen_random_uuid(), 'Телефоны', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  (gen_random_uuid(), 'Компьютеры', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  (gen_random_uuid(), 'Ноутбуки', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  (gen_random_uuid(), 'Планшеты и электронные книги', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  (gen_random_uuid(), 'Фото- и видеокамеры', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  (gen_random_uuid(), 'Аудио и видео', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  (gen_random_uuid(), 'Игры, приставки и программы', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  (gen_random_uuid(), 'Настольные компьютеры', (SELECT id FROM categories WHERE name = 'Электроника'));

-- 5. Личные вещи
INSERT INTO categories (id,name) VALUES
    (gen_random_uuid(), 'Личные вещи');

INSERT INTO subcategories (id,name, category_id) VALUES
                                                  (gen_random_uuid(), 'Одежда, обувь, аксессуары', (SELECT id FROM categories WHERE name = 'Личные вещи')),
                                                  (gen_random_uuid(), 'Детская одежда и обувь', (SELECT id FROM categories WHERE name = 'Личные вещи')),
                                                  (gen_random_uuid(), 'Товары для детей и игрушки', (SELECT id FROM categories WHERE name = 'Личные вещи')),
                                                  (gen_random_uuid(), 'Красота и здоровье', (SELECT id FROM categories WHERE name = 'Личные вещи')),
                                                  (gen_random_uuid(), 'Часы и украшения', (SELECT id FROM categories WHERE name = 'Личные вещи'));

-- 6. Для дома и дачи
INSERT INTO categories (id,name) VALUES
    (gen_random_uuid(), 'Для дома и дачи');

INSERT INTO subcategories (id,name, category_id) VALUES
                                                  (gen_random_uuid(), 'Мебель и интерьер', (SELECT id FROM categories WHERE name = 'Для дома и дачи')),
                                                  (gen_random_uuid(), 'Посуда и товары для кухни', (SELECT id FROM categories WHERE name = 'Для дома и дачи')),
                                                  (gen_random_uuid(), 'Ремонт и строительство', (SELECT id FROM categories WHERE name = 'Для дома и дачи')),
                                                  (gen_random_uuid(), 'Бытовая техника', (SELECT id FROM categories WHERE name = 'Для дома и дачи')),
                                                  (gen_random_uuid(), 'Растения', (SELECT id FROM categories WHERE name = 'Для дома и дачи'));

-- 7. Услуги
INSERT INTO categories (id,name) VALUES
    (gen_random_uuid(), 'Услуги');

INSERT INTO subcategories (id,name, category_id) VALUES
                                                  (gen_random_uuid(), 'Предложение услуг', (SELECT id FROM categories WHERE name = 'Услуги')),
                                                  (gen_random_uuid(), 'Деловые услуги', (SELECT id FROM categories WHERE name = 'Услуги')),
                                                  (gen_random_uuid(), 'Обучение, курсы', (SELECT id FROM categories WHERE name = 'Услуги'));

-- 8. Хобби и отдых
INSERT INTO categories (id,name) VALUES
    (gen_random_uuid(), 'Хобби и отдых');

INSERT INTO subcategories (id,name, category_id) VALUES
                                                  (gen_random_uuid(), 'Билеты и путешествия', (SELECT id FROM categories WHERE name = 'Хобби и отдых')),
                                                  (gen_random_uuid(), 'Спорт и отдых', (SELECT id FROM categories WHERE name = 'Хобби и отдых')),
                                                  (gen_random_uuid(), 'Книги и журналы', (SELECT id FROM categories WHERE name = 'Хобби и отдых')),
                                                  (gen_random_uuid(), 'Коллекционирование', (SELECT id FROM categories WHERE name = 'Хобби и отдых')),
                                                  (gen_random_uuid(), 'Музыкальные инструменты', (SELECT id FROM categories WHERE name = 'Хобби и отдых'));

-- 9. Животные
INSERT INTO categories (id,name) VALUES
    (gen_random_uuid(), 'Животные');

INSERT INTO subcategories (id,name, category_id) VALUES
                                                  (gen_random_uuid(), 'Кошки', (SELECT id FROM categories WHERE name = 'Животные')),
                                                  (gen_random_uuid(), 'Собаки', (SELECT id FROM categories WHERE name = 'Животные')),
                                                  (gen_random_uuid(), 'Птицы', (SELECT id FROM categories WHERE name = 'Животные')),
                                                  (gen_random_uuid(), 'Аквариум', (SELECT id FROM categories WHERE name = 'Животные')),
                                                  (gen_random_uuid(), 'Товары для животных', (SELECT id FROM categories WHERE name = 'Животные'));

-- 10. Для бизнеса
INSERT INTO categories (id,name) VALUES
    (gen_random_uuid(), 'Для бизнеса');

INSERT INTO subcategories (id,name, category_id) VALUES
                                                  (gen_random_uuid(), 'Оборудование для бизнеса', (SELECT id FROM categories WHERE name = 'Для бизнеса')),
                                                  (gen_random_uuid(), 'Готовый бизнес', (SELECT id FROM categories WHERE name = 'Для бизнеса')),
                                                  (gen_random_uuid(), 'Франшизы', (SELECT id FROM categories WHERE name = 'Для бизнеса'));
