FROM node:10.16

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
COPY . .

EXPOSE 5000

CMD npm run dev