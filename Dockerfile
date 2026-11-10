FROM node:18-alpine AS build

WORKDIR /app

ARG VITE_APP_NAME="Web Beta"
ARG VITE_THEME_COLOR="#2563eb"

ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_THEME_COLOR=$VITE_THEME_COLOR

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine AS serve

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
