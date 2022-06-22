// controllers/comments.js
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = (app) => {
	
	// CREATE Comment
	app.post('/posts/:postId/comments', (req, res) => {
		const comment = new Comment(req.body);
		comment.author = req.user._id;
		comment.post = req.params.postId;
		comment
			.save()
			.then(() => Promise.all([
				Post.findById(req.params.postId),
			]))
			.then(([post]) => {
				post.comments.unshift(comment);
				return Promise.all([
					post.save(),
				]);
			})
			.then(() => res.redirect(`/posts/${req.params.postId}`))
			.catch((err) => {
				console.log(err);
			});
	});

	// DELETE
};

// module.exports = (app) => {

//     // CREATE
//     app.post('/posts/:postId/comments', (req, res) => {
//         if (req.user) {

//             // INSTANTIATE INSTANCE OF MODEL
//             const comment = new Comment(req.body);
//             const userId = req.user._id;
//             const postId = req.params.postId;
//             comment.author = userId;
//             comment.post = postId;
//             console.log(comment)

//             // SAVE INSTANCE OF Comment MODEL TO DB
//             comment.save().then(() => Post.findById(req.params.postId)).then((post) => {
//                 post.comments.unshift(comment);
//                 console.log(post.comments)
//                 return post.save();
//             }).then((post) => res.redirect(`/posts/${post._id}`)).catch((err) => {
//                 console.log(err);
//             });

//         } else {
//             res.render('error', { errorMessage:'You need to be logged in to see this page.' })
//             return res.status(401); // UNAUTHORIZED
//         };
//     });
    
//     // DELETE

// };