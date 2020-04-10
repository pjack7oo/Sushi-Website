//Server routes and controllers were built from tutorial https://jorgeramon.me/the-meeting-room-booking-app-tutorial/

const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      expressSession = require('express-session'),
      MongoStore    = require('connect-mongo')(expressSession),
      accountRoutes = require('../server/routes/account');

const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 5000;
const router = express.Router();


var app = express();

const publicDir = path.join(__dirname, '../');

router.get('/',function(req,res){
  res.sendFile(path.join(publicDir + '/public/main2.html'));
  //__dirname : It will resolve to your project folder.
});


// var app = express()
//   .use(express.static(path.join(publicDir, 'public')))
//   .use('/', router)
  
  
//   //.get('/', (req, res) => res.render('main2.html'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
//   // .on('SIGTERM')





  // process.on('SIGTERM', () => {
  //   console.info('SIGTERM signal received.');
  //   console.log('Closing http server.');
  //   server.close(() => {
  //     console.log('Http server closed.');
  //   });
  // });
  app.use(express.static(path.join(publicDir, 'public')));
  app.use('/', router);

var dbName = 'SushiCatDB';
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString);
mongoose.once = function() {
  console.log(true);
};

app.use(expressSession({
  secret: 'foo',
  resave: true,
  store : new MongoStore({
    mongooseConnection: mongoose,
    secret: 'bar',
    autoRemove: 'disabled'
  }),
  saveUninitialized: true

}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use('/api', accountRoutes)



var server = app.listen(PORT, function() {
  console.log(`Listening on ${ PORT }`);
})

module.exports= server;
// var app = express();

// const publicDir = path.join(__dirname, 'public');

// app.use(express.static(publicDir));





// app.use('/', router);
// //const port = process.env.PORT || 3030;


// // // app.get('/', function(req,res) {
// // //   res.render('./main2.html');
// // // });

// app.listen(PORT);
