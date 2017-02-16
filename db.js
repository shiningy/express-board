/**
 * Created by shiningy on 2017. 2. 11..
 */
var mongoose = require('mongoose');
var passport = require('passport');

var userSchema = mongoose.Schema({
    local           : {
        email       : String,
        password    : String,
    },
    facebook        : {
        id          : String,
        token       : String,
        email       : String,
        name        : String
    }
});

mongoose.model('User', userSchema);

var Schema = mongoose.Schema;

var Post = new Schema({
    author      : {type: String, required: true},
    title       : {type: String, required: true},
    body        : {type: String, required: true},
    created_at  : {type: Date, default: Date.now},
    updated_at  : Date
});

mongoose.model('Post', Post);

mongoose.connect('mongodb://localhost/express-board');
