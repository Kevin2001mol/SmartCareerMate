# Stage 1: build
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: serve
FROM nginx:stable-alpine

# Eliminamos la configuración por defecto de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/

# Copiamos **el contenido** de dist/frontend al root de nginx
COPY --from=build /app/dist/frontend/ /usr/share/nginx/html/

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
