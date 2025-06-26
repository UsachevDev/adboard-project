INSERT INTO reviews (id, buyer_id, seller_id, announcement_id, score, description)
VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user1@example.com'), (SELECT id FROM users WHERE email = 'user2@example.com'), (SELECT id FROM announcements WHERE title = 'Продажа 2-комнатной квартиры'), 4, 'Отличная сделка, все четко!'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user2@example.com'), (SELECT id FROM users WHERE email = 'user3@example.com'), (SELECT id FROM announcements WHERE title = 'Аренда комнаты'), 5, 'Очень доволен, рекомендую!'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user3@example.com'), (SELECT id FROM users WHERE email = 'user4@example.com'), (SELECT id FROM announcements WHERE title = 'Дача на 6 соток'), 3, 'Нормально, но доставка медленная.'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user4@example.com'), (SELECT id FROM users WHERE email = 'user5@example.com'), (SELECT id FROM announcements WHERE title = 'Участок 10 соток'), 4, 'Хороший участок, как описано.'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user5@example.com'), (SELECT id FROM users WHERE email = 'user6@example.com'), (SELECT id FROM announcements WHERE title = 'Гараж в центре'), 5, 'Быстро и качественно!'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user6@example.com'), (SELECT id FROM users WHERE email = 'user7@example.com'), (SELECT id FROM announcements WHERE title = 'Продажа BMW X5'), 2, 'Машина с проблемами, не рекомендую.'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user7@example.com'), (SELECT id FROM users WHERE email = 'user8@example.com'), (SELECT id FROM announcements WHERE title = 'Мотоцикл Yamaha'), 4, 'Хороший мотоцикл, но цена высокая.'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user8@example.com'), (SELECT id FROM users WHERE email = 'user9@example.com'), (SELECT id FROM announcements WHERE title = 'Грузовик MAN'), 5, 'Отличная техника, все работает!'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user9@example.com'), (SELECT id FROM users WHERE email = 'user10@example.com'), (SELECT id FROM announcements WHERE title = 'Лодка с мотором'), 3, 'Нормально, но нужен ремонт.'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user10@example.com'), (SELECT id FROM users WHERE email = 'user1@example.com'), (SELECT id FROM announcements WHERE title = 'iPhone 13'), 4, 'Телефон в хорошем состоянии.'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user1@example.com'), (SELECT id FROM users WHERE email = 'user2@example.com'), (SELECT id FROM announcements WHERE title = 'Ноутбук Dell'), 5, 'Быстрая доставка, спасибо!'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user2@example.com'), (SELECT id FROM users WHERE email = 'user3@example.com'), (SELECT id FROM announcements WHERE title = 'Камера Canon'), 4, 'Качественная камера, доволен.'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user3@example.com'), (SELECT id FROM users WHERE email = 'user4@example.com'), (SELECT id FROM announcements WHERE title = 'Куртка зимняя'), 3, 'Размер маловат, но носибельно.'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user4@example.com'), (SELECT id FROM users WHERE email = 'user5@example.com'), (SELECT id FROM announcements WHERE title = 'Игрушка LEGO'), 5, 'Отличный подарок для ребенка!'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user5@example.com'), (SELECT id FROM users WHERE email = 'user6@example.com'), (SELECT id FROM announcements WHERE title = 'Диван угловой'), 4, 'Удобный, но сборка сложная.'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user6@example.com'), (SELECT id FROM users WHERE email = 'user7@example.com'), (SELECT id FROM announcements WHERE title = 'Холодильник Bosch'), 5, 'Работает идеально, спасибо!'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user7@example.com'), (SELECT id FROM users WHERE email = 'user8@example.com'), (SELECT id FROM announcements WHERE title = 'Ремонт квартир'), 3, 'Работа сделана, но задержки были.'),
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'user8@example.com'), (SELECT id FROM users WHERE email = 'user9@example.com'), (SELECT id FROM announcements WHERE title = 'Билеты на концерт'), 4, 'Билеты настоящие, все прошло хорошо.');

INSERT INTO favorites (user_id, announcement_id)
VALUES
    ((SELECT id FROM users WHERE email = 'user1@example.com'), (SELECT id FROM announcements WHERE title = 'Продажа 2-комнатной квартиры')),
    ((SELECT id FROM users WHERE email = 'user1@example.com'), (SELECT id FROM announcements WHERE title = 'iPhone 13')),
    ((SELECT id FROM users WHERE email = 'user2@example.com'), (SELECT id FROM announcements WHERE title = 'Аренда комнаты')),
    ((SELECT id FROM users WHERE email = 'user2@example.com'), (SELECT id FROM announcements WHERE title = 'Ноутбук Dell')),
    ((SELECT id FROM users WHERE email = 'user3@example.com'), (SELECT id FROM announcements WHERE title = 'Дача на 6 соток')),
    ((SELECT id FROM users WHERE email = 'user4@example.com'), (SELECT id FROM announcements WHERE title = 'Участок 10 соток')),
    ((SELECT id FROM users WHERE email = 'user5@example.com'), (SELECT id FROM announcements WHERE title = 'Гараж в центре')),
    ((SELECT id FROM users WHERE email = 'user6@example.com'), (SELECT id FROM announcements WHERE title = 'Продажа BMW X5'))
