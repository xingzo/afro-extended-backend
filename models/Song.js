const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'track'
  },
  mp3: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  bpm: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Song = mongoose.model('song', SongSchema);
