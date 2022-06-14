// controllers/posts.js

const Post = require('../models/post');
const moment = require('moment');

module.exports = (app) => {

    // INDEX
    // app.get('/', (req, res) => {
    //   const currentUser = req.user;
    //   console.log('currentUser', currentUser)
    //   Post.find({}).lean()
    //     .then((posts) => res.render('posts-index', { posts, currentUser }))
    //     .catch((err) => {
    //       console.log(err.message);
    //     });
    // });

    // ASYNC AWAIT
    app.get('/', async (req, res) => {
        try {
            const currentUser = await req.user;
            console.log(currentUser)
            const posts = await Post.find({}).lean();
            return res.render('posts-index', { posts, currentUser });
        } catch (err) {
            console.log(err.message);
        }
    });

    // NEW POST
    app.get('/posts/new', (req, res) => {
      if (req.user) {
          const currentUser = req.user;
          res.render('posts-new', { currentUser });
      } else {
          console.log('unauthorized')
          res.render('error', { errorMessage:'You need to be logged in to see this page.' })
          return res.status(401); // UNAUTHORIZED
      }
    });

    // CREATE
    app.post('/posts/new', (req, res) => {
        if (req.user) {
            const post = new Post(req.body);
            console.log('authorized')
            post.save(() => res.redirect('/'));
        } else {
            console.log('unauthorized')
            return res.status(401); // UNAUTHORIZED
        }
    });

    // SHOW SINGLE POST
    app.get('/posts/:id', (req, res) => {
        // LOOK UP THE POST
        const currentUser = req.user;
        Post
        .findById(req.params.id).lean().populate('comments')
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
        Post.find({ subreddit: req.params.subreddit }).lean()
        .then((posts) => res.render('posts-index', { posts, currentUser }))
        .catch((err) => {
            console.log(err);
        });
    });

  };  