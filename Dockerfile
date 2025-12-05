# Etapa 1: build Angular
FROM node:20 AS build
WORKDIR /app
#COPY package*.json ./
#RUN npm ci
COPY . .
#RUN npm run build --configuration=production

# Etapa 2: servidor
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 👉 Copiamos el build generado por Ionic/Angular a Nginx
COPY --from=build /app/www /usr/share/nginx/html
