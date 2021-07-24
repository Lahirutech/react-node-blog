const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 15
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: false,
        max: 32
    },
    profile: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }]
});




//https://mongoosejs.com/docs/api.html#schema_Schema-pre
UserSchema.pre('save', function (next) {
    if (!this.isModified('password'))
        return next();
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if (err)
            return next(err);
        this.password = passwordHash;
        next();
    });
})

UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err)
            return cb(err);
        else {
            if (!isMatch) {
                return cb(null, isMatch);
            } else {
                let NewUser = {
                    _id: this._id,
                    role: this.role,
                    username: this.username
                }
                return cb(null, NewUser);
            }
        }
    });
}


module.exports = mongoose.model('User', UserSchema);