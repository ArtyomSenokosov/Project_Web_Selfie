FROM node:14 AS frontend-build
WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web/ ./
RUN npm run build

FROM node:14
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY --from=frontend-build /app/web/build ./public
COPY server/ ./
EXPOSE 4000
CMD ["npm", "start"]

