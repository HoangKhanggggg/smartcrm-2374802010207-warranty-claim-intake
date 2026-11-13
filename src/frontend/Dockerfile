
# Giai đoạn 1: Build React bằng Vite
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Giai đoạn 2: Phục vụ file tĩnh bằng Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
