import mongoose from 'mongoose';

const circleMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  optOutOfLeaderboard: {
    type: Boolean,
    default: false
  },
  communityPoints: {
    type: Number,
    default: 0
  }
});

const circleEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const circleChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['streak', 'completion', 'consistency'],
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  pointsReward: {
    type: Number,
    required: true,
    default: 50
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    progress: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const circleMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reported: {
    type: Boolean,
    default: false
  },
  reportedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reportReasons: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'harassment', 'inappropriate', 'offensive', 'other']
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  hidden: {
    type: Boolean,
    default: false
  }
});

const communityCircleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [circleMemberSchema],
  maxMembers: {
    type: Number,
    default: 10,
    min: 2,
    max: 50
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  moderationSettings: {
    maxMessagesPerDay: {
      type: Number,
      default: 10
    },
    profanityFilterEnabled: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    }
  },
  messages: [circleMessageSchema],
  events: [circleEventSchema],
  challenges: [circleChallengeSchema],
  leaderboardUpdateDay: {
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    default: 'Sunday'
  },
  lastLeaderboardUpdate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
communityCircleSchema.index({ createdBy: 1 });
communityCircleSchema.index({ 'members.userId': 1 });
communityCircleSchema.index({ inviteCode: 1 });

// Virtual for member count
communityCircleSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for available spots
communityCircleSchema.virtual('availableSpots').get(function() {
  return this.maxMembers - this.members.length;
});

// Method to check if user is member
communityCircleSchema.methods.isMember = function(userId) {
  return this.members.some(m => {
    // Handle both populated (object with _id) and unpopulated (ObjectId) cases
    const memberId = m.userId._id || m.userId;
    return memberId.toString() === userId.toString();
  });
};

// Method to check if user is admin
communityCircleSchema.methods.isAdmin = function(userId) {
  const member = this.members.find(m => {
    // Handle both populated (object with _id) and unpopulated (ObjectId) cases
    const memberId = m.userId._id || m.userId;
    return memberId.toString() === userId.toString();
  });
  return member && member.role === 'admin';
};

// Method to add member
communityCircleSchema.methods.addMember = function(userId, role = 'member') {
  if (this.isMember(userId)) {
    throw new Error('User is already a member');
  }
  if (this.members.length >= this.maxMembers) {
    throw new Error('Circle is full');
  }
  this.members.push({ userId, role });
  return this.save();
};

// Method to remove member
communityCircleSchema.methods.removeMember = function(userId) {
  const memberIndex = this.members.findIndex(m => m.userId.toString() === userId.toString());
  if (memberIndex === -1) {
    throw new Error('User is not a member');
  }
  this.members.splice(memberIndex, 1);
  return this.save();
};

// Method to add message
communityCircleSchema.methods.addMessage = function(userId, content) {
  if (!this.isMember(userId)) {
    throw new Error('Only members can post messages');
  }
  
  // Check rate limiting
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const userMessagesToday = this.messages.filter(m => 
    m.userId.toString() === userId.toString() && 
    m.createdAt >= today
  ).length;
  
  if (userMessagesToday >= this.moderationSettings.maxMessagesPerDay) {
    throw new Error('Daily message limit reached');
  }
  
  this.messages.push({ userId, content });
  return this.save();
};

// Method to promote member to admin
communityCircleSchema.methods.promoteMember = function(userId, targetUserId) {
  if (!this.isAdmin(userId)) {
    throw new Error('Only admins can promote members');
  }
  const member = this.members.find(m => m.userId.toString() === targetUserId.toString());
  if (!member) {
    throw new Error('User is not a member');
  }
  member.role = 'admin';
  return this.save();
};

// Method to remove member (admin only)
communityCircleSchema.methods.removeMemberByAdmin = function(adminId, targetUserId) {
  if (!this.isAdmin(adminId)) {
    throw new Error('Only admins can remove members');
  }
  if (this.createdBy.toString() === targetUserId.toString()) {
    throw new Error('Cannot remove circle creator');
  }
  return this.removeMember(targetUserId);
};

// Method to add community points
communityCircleSchema.methods.addCommunityPoints = function(userId, points) {
  const member = this.members.find(m => m.userId.toString() === userId.toString());
  if (!member) {
    throw new Error('User is not a member');
  }
  member.communityPoints = (member.communityPoints || 0) + points;
  return this.save();
};

// Method to add event
communityCircleSchema.methods.addEvent = function(userId, eventData) {
  if (!this.isAdmin(userId)) {
    throw new Error('Only admins can create events');
  }
  this.events.push({
    ...eventData,
    createdBy: userId
  });
  return this.save();
};

// Method to add challenge
communityCircleSchema.methods.addChallenge = function(userId, challengeData) {
  if (!this.isAdmin(userId)) {
    throw new Error('Only admins can create challenges');
  }
  this.challenges.push({
    ...challengeData,
    createdBy: userId
  });
  return this.save();
};

// Method to join challenge
communityCircleSchema.methods.joinChallenge = function(userId, challengeId) {
  if (!this.isMember(userId)) {
    throw new Error('Only members can join challenges');
  }
  const challenge = this.challenges.id(challengeId);
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  const alreadyJoined = challenge.participants.some(p => p.userId.toString() === userId.toString());
  if (alreadyJoined) {
    throw new Error('Already joined this challenge');
  }
  challenge.participants.push({ userId, progress: 0, completed: false });
  return this.save();
};

// Method to update challenge progress
communityCircleSchema.methods.updateChallengeProgress = function(userId, challengeId, progress) {
  const challenge = this.challenges.id(challengeId);
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  const participant = challenge.participants.find(p => p.userId.toString() === userId.toString());
  if (!participant) {
    throw new Error('Not participating in this challenge');
  }
  participant.progress = progress;
  if (progress >= challenge.target && !participant.completed) {
    participant.completed = true;
    participant.completedAt = new Date();
    // Award community points
    this.addCommunityPoints(userId, challenge.pointsReward);
  }
  return this.save();
};

const CommunityCircle = mongoose.model('CommunityCircle', communityCircleSchema);

export default CommunityCircle;
