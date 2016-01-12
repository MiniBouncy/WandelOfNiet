var mongoose = require('mongoose');

exports = module.exports = {
  model: function(modelName, schema){
    return mongoose.model(modelName, schema);
  },

  Schema: function(){
    return _Schema;
  },

  Schema: function(args){
    return new _Schema(args);
  }
};
exports.ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.connect('mongodb://localhost/gamblr');

var _Schema = mongoose.Schema;
