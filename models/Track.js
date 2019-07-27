const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  artists: {
    type: [String],
    required: true
  },
  songs: [
    {
      song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'songs'
      }
    }
  ],
  countries: {
    type: [String],
    required: true
  },
  regions: {
    type: [String],
    required: true
  },
  tags: {
    type: [String]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Track = mongoose.model('track', TrackSchema);
