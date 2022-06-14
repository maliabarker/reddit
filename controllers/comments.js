// controllers/comments.js
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = (app) => {
    
    // CREATE Comment
    app.post('/posts/:postId/comments', (req, res) => {
        // INSTANTIATE INSTANCE OF MODEL
        const comment = new Comment(req.body);
    
        // SAVE INSTANCE OF Comment MODEL TO DB
        comment
        .save()
        .then(() => Post.findById(req.params.postId))
        .then((post) => {
            post.comments.unshift(comment);
            console.log(post.comments)
            return post.save();
        })
        .then(() => res.redirect('/'))
        .catch((err) => {
            console.log(err);
        });
    });

    // CREATE
    app.post('/posts/:postId/comments', (req, res) => {
        if (req.user) {
            // INSTANTIATE INSTANCE OF MODEL
            const comment = new Comment(req.body);
            const userId = req.user._id;
            comment.author = userId;
            // SAVE INSTANCE OF Comment MODEL TO DB
            comment
            .save()
            .then(() => Post.findById(req.params.postId))
            .then((post) => {
                post.comments.unshift(comment);
                console.log(post.comments)
                return post.save();
            })
            .then(() => res.redirect(`/posts/${post._id}`))
            .catch((err) => {
                console.log(err);
            });
        } else {
          res.render('error', { errorMessage:'You need to be logged in to see this page.' })
          return res.status(401); // UNAUTHORIZED
        }
      });

};