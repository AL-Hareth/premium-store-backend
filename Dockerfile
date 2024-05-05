FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

ENV NODE_ENV=production

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
