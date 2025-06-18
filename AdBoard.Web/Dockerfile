# Используем легковесный образ Node.js v18
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости с помощью npm
RUN npm install

# Открываем порт, на котором работает Next.js в режиме разработки
EXPOSE 3000

# Команда для запуска сервера разработки с Turbopack, как в вашем package.json
CMD ["npm", "run", "dev"]
