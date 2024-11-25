# Sử dụng Node.js LTS làm base image
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React (output sẽ nằm trong thư mục build/)
RUN npm run build

# Sử dụng Nginx để phục vụ ứng dụng React
FROM nginx:alpine

# Sao chép file build của React vào thư mục phục vụ của Nginx
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Mở cổng 80 cho Nginx
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]
