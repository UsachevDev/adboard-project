-- Создание таблицы categories с автоматической генерацией UUID
CREATE TABLE IF NOT EXISTS categories (
                                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                          name VARCHAR(255) NOT NULL
);

-- Создание таблицы subcategories с автоматической генерацией UUID
CREATE TABLE IF NOT EXISTS subcategories (
                                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                             name VARCHAR(255) NOT NULL,
                                             category_id UUID NOT NULL,
                                             FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Вставка данных в таблицу categories и subcategories без указания id

-- 1. Недвижимость
INSERT INTO categories (name) VALUES
    ('Недвижимость');

INSERT INTO subcategories (name, category_id) VALUES
                                                  ('Квартиры', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  ('Комнаты', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  ('Дома, дачи, коттеджи', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  ('Земельные участки', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  ('Гаражи и машиноместа', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  ('Коммерческая недвижимость', (SELECT id FROM categories WHERE name = 'Недвижимость')),
                                                  ('Недвижимость за рубежом', (SELECT id FROM categories WHERE name = 'Недвижимость'));

-- 2. Транспорт
INSERT INTO categories (name) VALUES
    ('Транспорт');

INSERT INTO subcategories (name, category_id) VALUES
                                                  ('Автомобили', (SELECT id FROM categories WHERE name = 'Транспорт')),
                                                  ('Мотоциклы и мототехника', (SELECT id FROM categories WHERE name = 'Транспорт')),
                                                  ('Грузовики и спецтехника', (SELECT id FROM categories WHERE name = 'Транспорт')),
                                                  ('Водный транспорт', (SELECT id FROM categories WHERE name = 'Транспорт')),
                                                  ('Запчасти и аксессуары', (SELECT id FROM categories WHERE name = 'Транспорт'));

-- 3. Работа
INSERT INTO categories (name) VALUES
    ('Работа');

INSERT INTO subcategories (name, category_id) VALUES
                                                  ('Вакансии', (SELECT id FROM categories WHERE name = 'Работа')),
                                                  ('Резюме', (SELECT id FROM categories WHERE name = 'Работа'));

-- 4. Электроника
INSERT INTO categories (name) VALUES
    ('Электроника');

INSERT INTO subcategories (name, category_id) VALUES
                                                  ('Телефоны', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  ('Компьютеры', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  ('Ноутбуки', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  ('Планшеты и электронные книги', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  ('Фото- и видеокамеры', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  ('Аудио и видео', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  ('Игры, приставки и программы', (SELECT id FROM categories WHERE name = 'Электроника')),
                                                  ('Настольные компьютеры', (SELECT id FROM categories WHERE name = 'Электроника'));

-- 5. Личные вещи
INSERT INTO categories (name) VALUES
    ('Личные вещи');

INSERT INTO subcategories (name, category_id) VALUES
                                                  ('Одежда, обувь, аксессуары', (SELECT id FROM categories WHERE name = 'Личные вещи')),
                                                  ('Детская одежда и обувь', (SELECT id FROM categories WHERE name = 'Личные вещи')),
                                                  ('Товары для детей и игрушки', (SELECT id FROM categories WHERE name = 'Личные вещи')),
                                                  ('Красота и здоровье', (SELECT id FROM categories WHERE name = 'Личные вещи')),
                                                  ('Часы и украшения', (SELECT id FROM categories WHERE name = 'Личные вещи'));

-- 6. Для дома и дачи
INSERT INTO categories (name) VALUES
    ('Для дома и дачи');

INSERT INTO subcategories (name, category_id) VALUES
                                                  ('Мебель и интерьер', (SELECT id FROM categories WHERE name = 'Для дома и дачи')),
                                                  ('Посуда и товары для кухни', (SELECT id FROM categories WHERE name = 'Для дома и дачи')),
                                                  ('Ремонт и строительство', (SELECT id FROM categories WHERE name = 'Для дома и дачи')),
                                                  ('Бытовая техника', (SELECT id FROM categories WHERE name = 'Для дома и дачи')),
                                                  ('Растения', (SELECT id FROM categories WHERE name = 'Для дома и дачи'));

-- 7. Услуги
INSERT INTO categories (name) VALUES
    ('Услуги');

INSERT INTO subcategories (name, category_id) VALUES
                                                  ('Предложение услуг', (SELECT id FROM categories WHERE name = 'Услуги')),
                                                  ('Деловые услуги', (SELECT id FROM categories WHERE name = 'Услуги')),
                                                  ('Обучение, курсы', (SELECT id FROM categories WHERE name = 'Услуги'));

-- 8. Хобби и отдых
INSERT INTO categories (name) VALUES
    ('Хобби и отдых');

INSERT INTO subcategories (name, category_id) VALUES
                                                  ('Билеты и путешествия', (SELECT id FROM categories WHERE name = 'Хобби и отдых')),
                                                  ('Спорт и отдых', (SELECT id FROM categories WHERE name = 'Хобби и отдых')),
                                                  ('Книги и журналы', (SELECT id FROM categories WHERE name = 'Хобби и отдых')),
                                                  ('Коллекционирование', (SELECT id FROM categories WHERE name = 'Хобби и отдых')),
                                                  ('Музыкальные инструменты', (SELECT id FROM categories WHERE name = 'Хобби и отдых'));

-- 9. Животные
INSERT INTO categories (name) VALUES
    ('Животные');

INSERT INTO subcategories (name, category_id) VALUES
                                                  ('Кошки', (SELECT id FROM categories WHERE name = 'Животные')),
                                                  ('Собаки', (SELECT id FROM categories WHERE name = 'Животные')),
                                                  ('Птицы', (SELECT id FROM categories WHERE name = 'Животные')),
                                                  ('Аквариум', (SELECT id FROM categories WHERE name = 'Животные')),
                                                  ('Товары для животных', (SELECT id FROM categories WHERE name = 'Животные'));

-- 10. Для бизнеса
INSERT INTO categories (name) VALUES
    ('Для бизнеса');

INSERT INTO subcategories (name, category_id) VALUES
                                                  ('Оборудование для бизнеса', (SELECT id FROM categories WHERE name = 'Для бизнеса')),
                                                  ('Готовый бизнес', (SELECT id FROM categories WHERE name = 'Для бизнеса')),
                                                  ('Франшизы', (SELECT id FROM categories WHERE name = 'Для бизнеса'));
