//Server routes and controllers were built from tutorial https://jorgeramon.me/the-meeting-room-booking-app-tutorial/
var fs = require('fs');
const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      expressSession = require('express-session'),
      MongoStore    = require('connect-mongo')(expressSession),
      accountRoutes = require('../server/routes/account'),
      RollSchema    = require('./models/rolls.js'),
      RollImageSchema = require('./models/rollImage.js');      

const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 5000;
const router = express.Router();
var rollUpload = require('./uploadRolls.js');

var app = express();

const publicDir = path.join(__dirname, '../');

router.get('/',function(req,res){
  res.sendFile(path.join(publicDir + '/public/main2.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/about', function(req, res) {
  res.sendStatus(404);
});

// router.route('/api')
// .get("/account/register", function(req, res) {
//   res.send("hello world");
// });
// router.post(function(req, res) {
//         console.log("register");
        
//         var accountController = new AccountController(User, req.session, mailer);
//         var userRegistration  = new UserRegistration(req.body);
//         var apiResponse1 = accountController.getUserFromRegistration(userRegistration);

//         res.set("Access-Control-Allow-Origin", url);

//         if (apiResponse1.success) {
//             accountController.register(apiResponse1.extras.user, function (err, apiResponse2) {
//                 return res.send(apiResponse2);
//             });
//         } else {
//             res.send(apiResponse1);
//         }
//     });
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
  // app.use(function(req, res, next){
  //   res.sendStatus(404);
  
  //   res.format({
  //     html: function () {
  //       res.render('404', { url: req.url })
  //     },
  //     json: function () {
  //       res.json({ error: 'Not found' })
  //     },
  //     default: function () {
  //       res.type('txt').send('Not found')
  //     }
  //   })
  // });

  app.use(express.static(path.join(publicDir, 'public')));
  

var dbName = 'SushiCatDB';
var connectionString = "mongodb+srv://piotr:12345@cluster0-q866k.mongodb.net/" + dbName;
var mongodbString = process.env.MONGODB_URI;
mongoose.connect(mongodbString);
var db = mongoose.connection;
// var callrollImage = './public/Images/californiaRoll.png';
// var alsakarollImage = './public/Images/alaskaroll.png'
// var calliforniaRoll = new RollSchema({
//   name: 'California Roll',
//   type: 'Roll',
//   inner: ["Avocado", "Crab", "Cucumber"],
//   outer: ["Rice"],
//   nori : true,
//   description: "Standard roll follow basic instructions",
//   image: {data: fs.readFileSync(callrollImage),contentType: "image/png"}
// });
// var AlaskaRoll = new RollSchema({
//   name: 'Alaska Roll',
//   type: 'Roll',
//   inner: ["Avocado", "Salmon"],
//   outer: ["Rice"],
//   nori : true,
//   description: "Standard roll follow basic instructions",
//   image: {data: fs.readFileSync(alsakarollImage), contentType: "image/png"}
// });

// db.once('open', function() {
//   calliforniaRoll.save();
//   AlaskaRoll.save();
// })  
//rollUpload(db);
app.use(expressSession({
  ker: 'session',
  secret: 'foo',
  resave: true,
  store : new MongoStore({
    mongooseConnection: db,
    secret: 'bar',
    autoRemove: 'disabled'
  }),
  saveUninitialized: true

}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// app.get('/404', function(req, res, next){
//   // trigger a 404 since no other middleware
//   // will match /404 after this one, and we're not
//   // responding here
//   next();
// });

app.use('/', router);
app.use('/api', accountRoutes);
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
