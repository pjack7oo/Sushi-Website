
const expect = require('chai').expect
const request = require('request');
const server = require('../server/index.js');

//Start the app
// const env = Object.assign({}, process.env, {PORT: 5000});
// const child = spawn('node', ['index.js'], {env});

// test('responds to requests', (t) => {
//   t.plan(4);

//   // Wait until the server is ready
//   child.stdout.on('data', _ => {
//     // Make a request to our app
//     request('http://127.0.0.1:5000', (error, response, body) => {
//       // stop the server
//       child.kill();

//       // No error
//       t.false(error);
//       // Successful response
//       t.equal(response.statusCode, 200);
//       // Assert content checks
//       t.notEqual(body.indexOf("<title>Node.js Getting Started on Heroku</title>"), -1);
//       t.notEqual(body.indexOf("Getting Started on Heroku with Node.js"), -1);
//     });
//   });
// });
describe('test', () => {

  

  it('should return 200 status code', function(done) {
    request('http://localhost:5000', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should return 404 status code', function(done) {
    request('http://localhost:5000/about', function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

  after( function(done) {
    server.close();
    delete require.cache[require.resolve('../server/index.js')];
    done();
  });
});

