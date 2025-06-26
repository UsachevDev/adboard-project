FROM node:18-alpine

WORKDIR /app

# Копируем только package.json и lockfile для кеша зависимостей
COPY package*.json ./

RUN npm install

# Теперь копируем всё приложение
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
