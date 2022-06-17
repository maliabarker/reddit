// controllers/posts.js

const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const moment = require('moment');

module.exports = (app) => {

    // INDEX
    // ASYNC AWAIT
    app.get('/', async (req, res) => {
        try {
            // const { user } = req;
            // console.log(req.cookies);
            const currentUser = await req.user;
            console.log(currentUser);
            const posts = await Post.find({}).lean().populate('author');
            return res.render('posts-index', { posts, currentUser });
        } catch (err) {
            console.log(err.message);
        };
    });

    // NEW POST
    app.get('/posts/new', (req, res) => {
        if (req.user) {
            const currentUser = req.user;
            res.render('posts-new', { currentUser });
        } else {
            console.log('unauthorized');
            res.render('error', { errorMessage:'You need to be logged in to see this page.' });
            return res.status(401); // UNAUTHORIZED
        };
    });

    // CREATE
    app.post('/posts/new', (req, res) => {
        if (req.user) {
            const userId = req.user._id;
            const post = new Post(req.body);
            post.author = userId;

            post.save().then(() => User.findById(userId)).then((user) => {
                user.posts.unshift(post);
                user.save();
                // REDIRECT TO THE NEW POST
                return res.redirect(`/posts/${post._id}`);
            }).catch((err) => {
                console.log(err.message);
            });
        } else {
            res.render('error', { errorMessage:'You need to be logged in to see this page.' })
            return res.status(401); // UNAUTHORIZED
        };
    });

    // SHOW SINGLE POST
    app.get('/posts/:id', (req, res) => {
        // LOOK UP THE POST
        const currentUser = req.user;
        Post.findById(req.params.id).lean().populate({ path:'comments', populate: { path: 'author' } }).populate('author')
        .then((post) => {
            let createdAt = post.createdAt;
            createdAt = moment(createdAt).format('MMMM Do YYYY, h:mm a');
            post.createdAtFormatted = createdAt;
            res.render('posts-show', { post, currentUser })
        })
        .catch((err) => {
            console.log(err.message);
        });
    });

    // SUBREDDIT
    app.get('/n/:subreddit', (req, res) => {
        const currentUser = req.user;
        Post.find({ subreddit: req.params.subreddit }).lean().populate('author')
        .then((posts) => res.render('posts-index', { posts, currentUser }))
        .catch((err) => {
            console.log(err);
        });
    });

    // DELETE
    

};  