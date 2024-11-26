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

# Cấp quyền chạy cho tất cả người dùng trong container (nếu cần thiết)
RUN chmod -R 755 .

# Mở cổng 5000 cho ứng dụng
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
