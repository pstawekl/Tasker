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

ENV NEXT_PUBLIC_FIREBASE_API_KEY='AIzaSyD5GyfxeMverkZ7ncS63-ePqUyStyo0QA8'
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN='tasker-a491a.firebaseapp.com'
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID='tasker-a491a'
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET='tasker-a491a.firebasestorage.app'
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID='111363514995'
ENV NEXT_PUBLIC_FIREBASE_APP_ID='1:111363514995:web:132ef6f1c1f87739d2c006'
ENV NEXT_PUBLIC_FIREBASE_APP_MEASUREMENT_ID='G-Y71W1ZXWX6'
ENV NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL='plstawekgame@gmail.com'
ENV NEXT_PUBLIC_FIREBASE_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC75Y+GQoSEz616\nq/Oum2g8f4XK5t1q37nHuAC6fCPtItXyczfIoTaFkwb4NBLuh7xwMikdMJWHjXOZ\nFCtOAFpzQQhhcQRX8cE0knQKgf6SPk9jCJNxgc7+U9BkEOt4rdc6yAyAMypxqdV0\n4bwYCjzSLOW/LoLZgFaKKYphiMWQ6GQb/p7rHIrRSP7mDdS4LYyeBXw1bpqnAJcX\nLSBUB+K1L9ejsOyLf7fs8KcmfNY/fBR5J5kbw7WQIlvMj0wTafx5YaSNc4KW9LIH\nIODfG/2DxIP8QL2KV2fxD3u/6nwDxj422aDkeyfARwoHJm6FQBb++wDM26X1krTZ\nqxEmfGpVAgMBAAECggEAAgsX8y0gm5pWKyBylajRl3k78orT+2UNp3So58Sqb8Cl\nh5QlyUDdKTlOzDH/LYJJYNKS0uMj3r9n84RRVXEe8RdS2+hqoS0BkMZLWVy0Vx4y\n89AOKZ/wddPIgnlF1K0Jsahz3/MIGG6KrtFqBiLnKjjCknOTIoIve4ootWQ5rcuf\njhAqto8tnZnkGzFFEx/uFT1wb5xW5/x5qNGqPMWlE7JBaelFjD6KMkOitxCTaQhq\n6t3Cr2RhlkDOf/vPCqp6F0p61xmMZO+79OnkRr6eLyrEu3M+0WK1Lbu0e6V2T5wl\nFrHJueeoep2mANQA7vu+hA5HmZLzkz2VusOv0/4UkQKBgQD+XwEmcPCkExWQH+/E\navkpX+eLdGFkIdaQL6PRByg8C3tsx1enUxUF+P6smuv8ktXw/xy6Cb9jYdUXpC/E\nNsACuv8uWC2zdmIWaauVXX2sJ1fteIf8T99/0EL7dHGfTZHSTyStKMczB4TLWAJR\ndhWnMloQ6RkPdjo6S+X3Fj0Z7QKBgQC9GZVZCb7uCseG9CzWpwCWsMPKX7fKLU+n\niiLh4B1ziMpljnrevFGJZeg3SQu0bCm6/fKbaiPdt3tL2RhdV5McM8fjTbz0/fjE\nHYfVSAqInGoJs9OGxp41xZq/GZlrt994yUFa3IDZEqfx3DfGf1CxB5MWhSEKBKh7\nk+gEvAxlCQKBgQDwL1DstVPj+UkxD5bcho3CbZY67adQX0s0Vmd+Zh2tpMHkUs4H\nZsHBI/2FibsugI+WwaykVbPr6WLGsfeQdIoVifCOGCD/BddUhm7H2MFjnrq9tkPh\nEKJfE41L1gW7gAki5iwhfRGqs3zGbNGzjaage0DkGtXY7a/JgAUirFMBeQKBgQCz\nrdt6/wesqBFu6hSw4X5tsQhZAxpfwS4uw9LhTVKutQub9AZMHiRbqbk8zuuQRDZi\nt2oOwovR4MYHDAFasBvYcFs+YF9rauc1cdnfjtRzeixHi9cx+QfbkCe57VkaQVzW\nKGUxMNQ9bryl09orgk3p6IianWUHX+W3hpKv7P7aAQKBgQCrKU/9MOILmfDb3X46\nw4me4PEJXRk3TQpfUce2zP9jtGUbbV7Eix8ULwS7cLjKiOa6Y6vMbw5Q6McBkHyI\nT3AzpSgs8ubyMh+Mpui7QeC5DXWNltezsCL2W9MEtIRs9ORfLf4+Wc56efTGlaRa\nUbZG70F3uIxsJ3sdgyjJr+8KOQ==\n-----END PRIVATE KEY-----\n'
ENV NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL='firebase-adminsdk-v34p3@tasker-a491a.iam.gserviceaccount.com'
ENV NEXT_PUBLIC_FIREBASE_TOKEN_URI='https://oauth2.googleapis.com/token'
ENV DB_HOST=194.88.244.251
ENV DB_NAME=tasker
ENV DB_USER=mytravel_test
ENV DB_PASSWORD=mytravel_test
ENV DB_PORT=19325

# Ustawienia katalogu aplikacji
WORKDIR /app

# Kopiowanie wyników z etapu budowania
COPY --from=build /package.json /package-lock.json ./
COPY --from=build /.next ./.next
COPY --from=build /public ./public
COPY --from=build /next.config.js ./

# Instalacja tylko produkcyjnych zależności
RUN npm install --only=production --legacy-peer-deps

ENV PORT=3000

# Eksponowanie portu aplikacji
EXPOSE 3000

# Uruchamianie aplikacji
CMD ["npm", "start"]
