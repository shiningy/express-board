var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();
var Post = mongoose.model('Post');

/* GET home page. */
router.get('/', function (req, res) {
    Post.find().sort('-created_at').exec(function (err, posts) {
        if (err) return res.json({success: false, message: err});
        res.render('index', {data: posts});
    });
});

/* Create post */
router.get('/create', function (req, res) {
    res.render('create');
});

router.post('/create', function (req, res) {
    new Post({
        title: req.body.title,
        body: req.body.content,
        created_at: Date.now()
    }).save(function (err, post, count) {
        res.redirect('/');
    });
});

/* Read by id post */
router.get('/show/:id', function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) return res.json({success: false, message: err});
        res.render('show', {data: post});
    });
});

router.get('/update/:id', function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) return res.json({success: false, message: err});
        res.render('edit', {data: post});
    })
});

router.post('/update/:id', function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        post.title = req.body.title;
        post.body = req.body.body;
        post.updated_at = Date.now();
        post.save(function (err) {
            res.redirect('/');
        });
    });
});

router.get('/delete/:id', function (req, res) {
    Post.findByIdAndRemove(req.params.id, function (err, post) {
        if (err) return res.json({success: false, message: err});
        res.redirect('/');
    });
});

router.get('/search', function (req, res) {
    var search_type = req.query.search_type.split('+');
    // console.log(search_type);
    var search_text = req.query.search_text;
    var query = {$or: []};
    search_type.forEach(function(type) {
        var sub_query = {};
        sub_query[type] = new RegExp(search_text, 'i');
        query['$or'].push(sub_query);
        console.log(sub_query);
    });
    // query[search_type] = new ReqExp(search_text, 'i');
    Post.find(query).exec(function (err, posts, count) {
        res.render('index', {data: posts});
    });
});



module.exports = router;
