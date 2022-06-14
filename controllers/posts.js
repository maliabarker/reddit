// controllers/posts.js

const Post = require('../models/post');
const moment = require('moment');

module.exports = (app) => {

    // INDEX
    app.get('/', (req, res) => {
        Post.find({}).lean()
          .then((posts) => {
              res.render('posts-index', { posts });
          })
          .catch((err) => {
              console.log(err.message);
        });
    });

    // ASYNC AWAIT
    // app.get('/', async (req, res) => {
    //     try {
    //         const posts = await Post.find({}).lean();
    //         return res.render('posts-index', { posts });
    //     } catch (err) {
    //         console.log(err.message);
    //     }
    // });

    // NEW POST
    app.get('/posts/new', (req, res) => {
        res.render('posts-new');
    });

    // CREATE
    app.post('/posts/new', (req, res) => {
        // INSTANTIATE INSTANCE OF POST MODEL
        const post = new Post(req.body);
        // SAVE INSTANCE OF POST MODEL TO DB AND REDIRECT TO THE ROOT
        post.save(() => res.redirect('/'));
    });

    // SHOW SINGLE POST
    app.get('/posts/:id', (req, res) => {
        // LOOK UP THE POST
        Post
        .findById(req.params.id).lean().populate('comments')
        .then((post) => {
            let createdAt = post.createdAt;
            createdAt = moment(createdAt).format('MMMM Do YYYY, h:mm a');
            post.createdAtFormatted = createdAt;
            res.render('posts-show', { post })
        })
        .catch((err) => {
            console.log(err.message);
        });
    });

    // SUBREDDIT
    app.get('/n/:subreddit', (req, res) => {
        Post.find({ subreddit: req.params.subreddit }).lean()
        .then((posts) => res.render('posts-index', { posts }))
        .catch((err) => {
            console.log(err);
        });
    });



  };  