FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install

COPY . .

RUN apk add --no-cache openssl

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD [ "sh", "-c", "npx prisma migrate deploy && npm start"]