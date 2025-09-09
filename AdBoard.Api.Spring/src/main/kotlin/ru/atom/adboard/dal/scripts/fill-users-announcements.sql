
--Вставка 10 пользователей (оставляем без изменений)
INSERT INTO users (id, email, password, created_at, name, phone_number, address)
VALUES
    (gen_random_uuid(), 'user1@example.com', '$2y$10$hJGoNBAqYC5CAoXLsOjiDe6/7D9xYe.pBlmnjzEMfzgMj83JtkjeG', CURRENT_TIMESTAMP, 'Иван Иванов', '+79161234567', 'Москва'),
    (gen_random_uuid(), 'user2@example.com', '$2y$10$SlCHL/6en94rkyeNqInBZ.vgE7wQ9DEgcnWvLNtxQ5etFz9ZdsCPC', CURRENT_TIMESTAMP, 'Мария Петрова', '+79261234568', 'Санкт-Петербург'),
    (gen_random_uuid(), 'user3@example.com', '$2y$10$iruAbg7bFaYeN0IQuQYldO3rT37DihoUfYU8P4dvbpL22W.S26oGy', CURRENT_TIMESTAMP, 'Алексей Сидоров', '+79361234569', 'Екатеринбург'),
    (gen_random_uuid(), 'user4@example.com', '$2y$10$pDXAgRmntAhBikolteKTBOa6lWbuLFZBtReTwznUyJyWIOy.kjmym', CURRENT_TIMESTAMP, 'Елена Козлова', '+79461234570', 'Новосибирск'),
    (gen_random_uuid(), 'user5@example.com', '$2y$10$y7a2F4FlRkpFbUy38WGQTe0XAV.VpEyW2B.nTaTHssTMXIXeUw5j2', CURRENT_TIMESTAMP, 'Дмитрий Орлов', '+79561234571', 'Казань'),
    (gen_random_uuid(), 'user6@example.com', '$2y$10$By2ZoOoeHW4D38iDMLXa7ulzPgQVPvfeNDbjcEMSTqAXfTH/g1sQS', CURRENT_TIMESTAMP, 'Ольга Иванова', '+79661234572', 'Ростов-на-Дону'),
    (gen_random_uuid(), 'user7@example.com', '$2y$10$.m8lY07rvRRSlG7K.zGbkuGM2l4yw/m4oXtxh7ErY9PtLyPLiHq2.', CURRENT_TIMESTAMP, 'Сергей Кузнецов', '+79761234573', 'Нижний Новгород'),
    (gen_random_uuid(), 'user8@example.com', '$2y$10$QfZQ1uSOagxCTory87YI7OM0u44O4EyLMPLN42qWmeVRIFLkUeoGK', CURRENT_TIMESTAMP, 'Анна Смирнова', '+79861234574', 'Красноярск'),
    (gen_random_uuid(), 'user9@example.com', '$2y$10$BXwMVCj8TblYrjJr5geQjuLyBimXV4HxCnvbqBZZ3cwbqXGzFLUGi', CURRENT_TIMESTAMP, 'Павел Морозов', '+79961234575', 'Воронеж'),
    (gen_random_uuid(), 'user10@example.com', '$2y$10$yz4Tj7/vOl/xvUfAPM4fZ.q0XeTOjArKUkPFnYKTM1S1OTDTf1e0W', CURRENT_TIMESTAMP, 'Наталья Лебедева', '+79061234576', 'Челябинск');

-- Вставка 25 объявлений (исправлена часть для "Услуги")
INSERT INTO announcements (id, creator_id, created_at, title, description, price, city, count, subcategory_id, is_hidden)
VALUES
    -- Недвижимость (оставляем без изменений)
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user1@example.com'), CURRENT_TIMESTAMP, 'Продажа 2-комнатной квартиры', 'Просторная квартира в центре', 4500000.00, 'Москва', 1, (SELECT id FROM subcategories WHERE name = 'Квартиры'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user2@example.com'), CURRENT_TIMESTAMP, 'Аренда комнаты', 'Комната с ремонтом', 15000.00, 'Санкт-Петербург', 1, (SELECT id FROM subcategories WHERE name = 'Комнаты'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user3@example.com'), CURRENT_TIMESTAMP, 'Дача на 6 соток', 'Уютный домик', 2500000.00, 'Екатеринбург', 1, (SELECT id FROM subcategories WHERE name = 'Дома, дачи, коттеджи'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user4@example.com'), CURRENT_TIMESTAMP, 'Участок 10 соток', 'Рядом лес', 1200000.00, 'Новосибирск', 1, (SELECT id FROM subcategories WHERE name = 'Земельные участки'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user5@example.com'), CURRENT_TIMESTAMP, 'Гараж в центре', 'Отличное состояние', 800000.00, 'Казань', 1, (SELECT id FROM subcategories WHERE name = 'Гаражи и машиноместа'), FALSE),

    -- Транспорт (оставляем без изменений)
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user6@example.com'), CURRENT_TIMESTAMP, 'Продажа BMW X5', '2018 год, отличное состояние', 3500000.00, 'Ростов-на-Дону', 1, (SELECT id FROM subcategories WHERE name = 'Автомобили'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user7@example.com'), CURRENT_TIMESTAMP, 'Мотоцикл Yamaha', '2019 год', 600000.00, 'Нижний Новгород', 1, (SELECT id FROM subcategories WHERE name = 'Мотоциклы и мототехника'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user8@example.com'), CURRENT_TIMESTAMP, 'Грузовик MAN', 'Б/у, для бизнеса', 2500000.00, 'Красноярск', 1, (SELECT id FROM subcategories WHERE name = 'Грузовики и спецтехника'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user9@example.com'), CURRENT_TIMESTAMP, 'Лодка с мотором', 'Хорошее состояние', 400000.00, 'Воронеж', 1, (SELECT id FROM subcategories WHERE name = 'Водный транспорт'), FALSE),

    -- Электроника (оставляем без изменений)
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user10@example.com'), CURRENT_TIMESTAMP, 'iPhone 13', '64GB, новый', 60000.00, 'Челябинск', 1, (SELECT id FROM subcategories WHERE name = 'Телефоны'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user1@example.com'), CURRENT_TIMESTAMP, 'Ноутбук Dell', 'i5, 8GB RAM', 45000.00, 'Москва', 1, (SELECT id FROM subcategories WHERE name = 'Ноутбуки'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user2@example.com'), CURRENT_TIMESTAMP, 'Камера Canon', 'Профессиональная', 80000.00, 'Санкт-Петербург', 1, (SELECT id FROM subcategories WHERE name = 'Фото- и видеокамеры'), FALSE),

    -- Личные вещи (оставляем без изменений)
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user3@example.com'), CURRENT_TIMESTAMP, 'Куртка зимняя', 'Размер M', 5000.00, 'Екатеринбург', 2, (SELECT id FROM subcategories WHERE name = 'Одежда, обувь, аксессуары'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user4@example.com'), CURRENT_TIMESTAMP, 'Игрушка LEGO', 'Новый набор', 3000.00, 'Новосибирск', 1, (SELECT id FROM subcategories WHERE name = 'Товары для детей и игрушки'), FALSE),

    -- Для дома и дачи (оставляем без изменений)
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user5@example.com'), CURRENT_TIMESTAMP, 'Диван угловой', 'Синий велюр', 25000.00, 'Казань', 1, (SELECT id FROM subcategories WHERE name = 'Мебель и интерьер'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user6@example.com'), CURRENT_TIMESTAMP, 'Холодильник Bosch', '150 см, новый', 35000.00, 'Ростов-на-Дону', 1, (SELECT id FROM subcategories WHERE name = 'Бытовая техника'), FALSE),

    -- Услуги (исправлено)
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user7@example.com'), CURRENT_TIMESTAMP, 'Ремонт квартир', 'Качественно и быстро', 5000.00, 'Нижний Новгород', 1, (SELECT id FROM subcategories WHERE name = 'Предложение услуг'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user7@example.com'), CURRENT_TIMESTAMP, 'Бухгалтерские услуги', 'Ведение учета для малого бизнеса', 3000.00, 'Нижний Новгород', 1, (SELECT id FROM subcategories WHERE name = 'Деловые услуги'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user7@example.com'), CURRENT_TIMESTAMP, 'Курсы английского', 'Онлайн уроки для начинающих', 2000.00, 'Нижний Новгород', 1, (SELECT id FROM subcategories WHERE name = 'Обучение, курсы'), FALSE),

    -- Хобби и отдых (оставляем без изменений)
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user8@example.com'), CURRENT_TIMESTAMP, 'Билеты на концерт', '2 билета', 8000.00, 'Красноярск', 2, (SELECT id FROM subcategories WHERE name = 'Билеты и путешествия'), FALSE),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user9@example.com'), CURRENT_TIMESTAMP, 'Гитара акустическая', 'Б/у, отличное состояние', 15000.00, 'Воронеж', 1, (SELECT id FROM subcategories WHERE name = 'Музыкальные инструменты'), FALSE),

    -- Животные (оставляем без изменений)
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user10@example.com'), CURRENT_TIMESTAMP, 'Котенок британец', '2 месяца', 10000.00, 'Челябинск', 1, (SELECT id FROM subcategories WHERE name = 'Кошки'), FALSE),

    -- Для бизнеса (оставляем без изменений)
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user1@example.com'), CURRENT_TIMESTAMP, 'Оборудование для кафе', 'Холодильник и плита', 200000.00, 'Москва', 1, (SELECT id FROM subcategories WHERE name = 'Оборудование для бизнеса'), FALSE);
