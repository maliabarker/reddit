const express = require('express');

const app = express();

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set db
require('./data/reddit-db');

const posts = require('./controllers/posts')(app);
const comments = require('./controllers/comments.js')(app);

// app.get('/', (req, res) => {
//     res.render('home');
// });

app.listen(3000);

module.exports = app;