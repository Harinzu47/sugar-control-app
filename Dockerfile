# --- Stage 1: Build Environment ---
# Menggunakan Node.js versi full (Debian-based) untuk menghindari masalah kompatibilitas build native (seperti imagemin/gifsicle)
FROM node:18 AS builder

# Set folder kerja di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json terlebih dahulu
# Ini memanfaatkan fitur caching Docker layer agar 'npm install' tidak diulang jika tidak ada perubahan dependency
COPY package*.json ./

# Install dependencies (image node:18 standar sudah menyertakan python/make/g++, jadi lebih aman)
RUN npm install

# Copy seluruh kode project ke dalam container
COPY . .

# Pastikan file .env ada jika diperlukan oleh dotenv-webpack saat build
# (Opsional: Jika kamu ingin mem-bake variabel environment ke dalam image)
# COPY .env .env

# Jalankan perintah build (hasilnya akan ada di folder /app/dist)
RUN npm run build

# --- Stage 2: Production Environment ---
# Menggunakan Nginx untuk melayani file statis (sangat ringan)
FROM nginx:alpine

# Copy hasil build dari Stage 1 ke folder default Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy konfigurasi Nginx kustom kita
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Buka port 80 (port standar web)
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]