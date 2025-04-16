const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
    api:{
    type: String,
    },
  request: {
    type: Object,
  },
  response: {
    type: Object,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Api = mongoose.model('ApiModel', apiSchema);

module.exports = Api;