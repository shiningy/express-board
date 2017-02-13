/**
 * Created by shiningy on 2017. 2. 11..
 */
var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var Post = new Schema({
    title       : {type: String, required: true},
    body       : {type: String, required: true},
    created_at  : {type: Date, default: Date.now},
    updated_at  : Date
});

mongoose.model('Post', Post);

mongoose.connect('mongodb://localhost/express-board');
