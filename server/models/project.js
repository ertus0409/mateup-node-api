var mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minglength: 1,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minglength: 10,
    trim: true
  },
  postDuration: {
    type: Number,
    requried: true
  },
  _datePosted: {
    type: Number,
  },
  contactInfo: {
    type:  String,
    required: true,
    minlength: 1,
  },
  category: {
    type: String,
    required: true
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Project = mongoose.model('Project', ProjectSchema);


module.exports = {Project}
