import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['swap_request', 'swap_accepted', 'swap_rejected', 'swap_completed', 'new_message', 'rating_received', 'admin_message'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  relatedSwap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Swap'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isDeleted: 1 });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema); 