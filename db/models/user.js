var mongo = require('../mongo');

// Scaffolding
var UserSchema = new mongo.Schema({
  username: { type: String, min: 4 },
  password: { type: String, min: 4 },
  display_name: { type: String, min: 4},
  member_since: { type: Number, default: Date.now() }, // Timestamp
});

var UserModel = mongo.model('User', UserSchema);

// Export
UserModel.schema = UserSchema;

module.exports = UserModel;

// Old, probably more safe and reliable code.
// This style, however, requires the use of
// the model property for every query.
// I.e. having to call User.model.find() as
// opposed to simply calling User.find()
/*
exports.new = function(){
  return new UserModel();
};

exports.model = UserModel;

exports.schema = UserSchema;
*/
