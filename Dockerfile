FROM node:22

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npx prisma generate

EXPOSE 8000

CMD ["npm", "run", "start:migrate:dev"]