FROM node:alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force
RUN npx prisma generate
COPY . .

RUN npm run build auth
RUN npx prisma generate

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production --force

COPY . .

COPY --from=development /usr/src/app/dist ./dist
RUN npx prisma generate
CMD ["node", "dist/apps/auth/main"]