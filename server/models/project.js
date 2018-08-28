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
  // type: {
  //   type: String,
  //   required: true
  // },
  // timePosted: {
  //   type: String,
  //   default: null
  // },
  // requirements: {
  //   type: String,
  //   required: true,
  //   minlength: 1,
  //   trim: true
  // },
  // contactInfo: {
  //   type: String,
  //   required: true,
  // },
  // _creator: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true
  // }
});

const Project = mongoose.model('Project', ProjectSchema);


module.exports = {Project}
