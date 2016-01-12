var mongo = require('../mongo');

// Scaffolding
var UserSchema = new mongo.Schema({
  username: { type: String, min: 4 },
  password: { type: String, min: 4 },
  location: { type: String, default: 'Unknown' },
  member_since: { type: Number, default: Date.now() }, // Timestamp
  credit_balance: { type: Number, default: 5000 },
  games_played: { type: Number, default: 0 },
  friends: [{ type: mongo.ObjectId, ref: 'User' }], // Array of user ids, foreign key
  session: {
    token: { type: String },
    expires: { type: Number } // Timestamp
  }
  // Alternatively, session_expires could also be set as a timestamp of when the
  // session was started. That way, you could easily implement a system like
  // Whatsapp's "Last seen on: <time>"
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
