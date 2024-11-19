import { Request } from "../Models/request_model.js";

import { User } from '../Models/user_model.js';

// Gửi request
export const createRequest = async (user_id, reason) => {
  // Kiểm tra nếu User tồn tại
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.role !== 0) {
    throw new Error('Only users with role user can create requests');
  }

  // Kiểm tra nếu đã có request đang chờ
  const existingRequest = await Request.findOne({
    where: { user_id, status: 'pending' },
  });

  if (existingRequest) {
    throw new Error('A pending request already exists for this user');
  }

  // Tạo request mới
  return await Request.create({ user_id, reason });
};


// Chấp nhận request
export const acceptRequest = async (requestId) => {
  const request = await Request.findByPk(requestId);
  if (!request) {
    throw new Error('Request not found');
  }

  if (request.status !== 'pending') {
    throw new Error('Only pending requests can be accepted');
  }

  // Cập nhật trạng thái request
  request.status = 'approved';
  await request.save();

  // Cập nhật role của user
  const user = await User.findByPk(request.user_id);
  if (!user) {
    throw new Error('User not found');
  }

  user.role = 1; // Chuyển user thành publisher
  await user.save();

  return { request, user };
};

// Từ chối request
export const rejectRequest = async (requestId) => {
  const request = await Request.findByPk(requestId);
  if (!request) {
    throw new Error('Request not found');
  }

  if (request.status !== 'pending') {
    throw new Error('Only pending requests can be rejected');
  }

  // Cập nhật trạng thái request
  request.status = 'rejected';
  await request.save();

  return request;
};

// Lấy danh sách requests cùng thông tin tên của user
export const getRequestsWithUserNames = async () => {
    return await Request.findAll({
        where: {
            status: 'pending', // Lọc chỉ các request có trạng thái "pending"
        },
        include: [
        {
          model: User,
          as: 'user', // Phải khớp với alias trong model
          attributes: ['user_name'], // Chỉ lấy trường user_name
        },
        ],
        order: [['createdAt', 'DESC']], // Sắp xếp theo thời gian tạo
    });
};
