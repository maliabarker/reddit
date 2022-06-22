// test/index.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before } = require('mocha');
const app = require('../app');

const Post = require('../models/post');
const User = require('../models/user');

const agent = chai.request.agent(app);

const should = chai.should();

chai.use(chaiHttp);

// TESTS
// How many posts are there now?
// Make a request to create another
// Check that the database has one more post in it
// Check that the response is successful

describe('site', function () {
  // Describe what you are testing
  it('Should have home page', function (done) {
    // Describe what should happen
    // In this case we test that the home page loads
    agent
      .get('/')
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        return done(); // Call done if the test completed successfully.
      });
  });
});


describe('Posts', function () {
    // Post that we'll use for testing purposes
    const newPost = {
      title: 'post title',
      url: 'https://www.google.com',
      summary: 'post summary',
      subreddit: 'a subreddit'
    };

    // User that we'll use for testing purposes
    const user = {
      username: 'poststest',
      password: 'testposts',
    };

    before(function (done) {
        agent
          .post('/sign-up')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send(user)
          .then(function (res) {
              done();
          }).catch(function (err) {
              done(err);
          });
    });

    it('Should create with valid attributes at POST /posts/new', function(done) {
        // Checks how many posts there are now
        Post.estimatedDocumentCount().then(function (initialDocCount) {
            agent
                .post('/posts/new')
                // This line fakes a form post, since we're not actually filling out a form
                .set('content-type', 'application/x-www-form-urlencoded')
                // Make a request to create another
                .send(newPost)
                .then(function (res) {
                    Post.estimatedDocumentCount().then(function (newDocCount) {
                        // Check that the database has status 200
                        res.should.have.status(200);
                        // Check that the database has one more post in it
                        newDocCount.should.equal(initialDocCount + 1)
                        done();
                    }).catch(function (err) { done(err); });
                }).catch(function (err) { done(err); });
        }).catch(function (err) { done(err); });
    });

    after(function (done) {
        Post.findOneAndDelete(newPost)
        .then(function () {
            agent.close();
        
            User
                .findOneAndDelete({
                    username: user.username,
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        })
        .catch(function (err) {
            done(err);
        });
    });
});