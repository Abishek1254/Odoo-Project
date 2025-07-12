import mongoose from 'mongoose';

const swapSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedSkill: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: [500, 'Skill description cannot be more than 500 characters']
    }
  },
  offeredSkill: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: [500, 'Skill description cannot be more than 500 characters']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  scheduledDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  feedback: {
    requesterRating: {
      type: Number,
      min: 1,
      max: 5
    },
    requesterComment: {
      type: String,
      maxlength: [500, 'Feedback comment cannot be more than 500 characters']
    },
    recipientRating: {
      type: Number,
      min: 1,
      max: 5
    },
    recipientComment: {
      type: String,
      maxlength: [500, 'Feedback comment cannot be more than 500 characters']
    }
  },
  isRead: {
    requester: {
      type: Boolean,
      default: false
    },
    recipient: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
swapSchema.index({ requester: 1, status: 1 });
swapSchema.index({ recipient: 1, status: 1 });
swapSchema.index({ status: 1, createdAt: -1 });

// Virtual for swap duration
swapSchema.virtual('duration').get(function() {
  if (this.completedDate && this.scheduledDate) {
    return Math.ceil((this.completedDate - this.scheduledDate) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Ensure virtual fields are serialized
swapSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.models.Swap || mongoose.model('Swap', swapSchema); 