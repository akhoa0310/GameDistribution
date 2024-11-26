import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Tạo thư mục lưu trữ nếu chưa tồn tại
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Lưu file zip tạm thời ở thư mục uploads
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, `${Date.now()}${extension}`);
    }
});

// Kiểm tra loại file tải lên
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.zip', '.rar', '.html', '.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed'), false);
    }
};

// Giới hạn kích thước file tải lên
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 10MB
    fileFilter
});

export default upload;
