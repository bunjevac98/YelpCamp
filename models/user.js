const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
/*
-plugin ce dodati nasoj semi user name dodace
 pasvord gledace da li su duplirani itd jos mnogo toga sve u ovom pluginu
*/
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
