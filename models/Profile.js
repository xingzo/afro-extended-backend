const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  country: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  social: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    itunes: {
      type: String
    },
    mixcloud: {
      type: String
    },
    soundcloud: {
      type: String
    },
    spotify: {
      type: String
    },
    twitter: {
      type: String
    },
    youtube: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
