const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports = (app) => {

    // SHOW USER
    app.get('/users/:username', (req, res) => {
        // GET USER
        User.findOne({ username: req.params.username }).lean().then((user) => {
            Post.find({ author: user }).lean().then((posts) => {
                Comment.find({ author: user}).lean().then((comments) => {
                    // console.log(user);
                    // console.log(posts);
                    // console.log(comments);
                    res.render('users-show', { user, posts, comments });
                });
            });
        });
    });
};