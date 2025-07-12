// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

// Response formatting
export const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

export const errorResponse = (message, statusCode = 400) => {
  return {
    success: false,
    message,
    statusCode
  };
};

// Pagination utilities
export const paginateResults = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

// Search utilities
export const createSearchQuery = (searchTerm, fields) => {
  if (!searchTerm) return {};
  
  const searchRegex = new RegExp(searchTerm, 'i');
  const searchQuery = {
    $or: fields.map(field => ({ [field]: searchRegex }))
  };
  
  return searchQuery;
};

// Date utilities
export const formatDate = (date) => {
  return new Date(date).toISOString();
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
};

// Error handling
export const handleAsyncError = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// File upload utilities
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.mimetype);
};

export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
}; 