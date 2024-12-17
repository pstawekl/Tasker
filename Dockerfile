# Etap 1: Budowanie aplikacji
FROM node:lts-alpine AS build

# Ustawienia katalogu aplikacji
WORKDIR /app

# Kopiowanie plików potrzebnych do instalacji zależności i budowy
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Kopiowanie całego kodu źródłowego
COPY . .

# Budowanie aplikacji Next.js
RUN npm run build

# ---------------

# Etap 2: Produkcyjny kontener
FROM node:lts-alpine

# Instalacja zależności systemowych wymaganych przez niektóre zależności Node.js
RUN apk add --no-cache python3 make g++

# Ustawienie zmiennych środowiskowych
ENV NODE_ENV production
ENV API_PORT 3001
ENV CYPRESS_INSTALL_BINARY=0

# Ustawienia katalogu aplikacji
WORKDIR /app

# Kopiowanie wyników z etapu budowania
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./
COPY --from=build /app/api-server.js ./
COPY --from=build /app/.env.local ./

# Instalacja tylko produkcyjnych zależności
RUN npm install --only=production --legacy-peer-deps

ENV PORT=3000

# Eksponowanie portu aplikacji
EXPOSE 3000

# Uruchamianie aplikacji
CMD ["npm", "start"]
