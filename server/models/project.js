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
    //Change minlength later on
    minglength: 3,
    trim: true
  },
  postDuration: {
    type: Number,
    requried: true
  },
  datePosted: {
    type: Number,
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Project = mongoose.model('Project', ProjectSchema);


module.exports = {Project}
