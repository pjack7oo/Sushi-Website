const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 5000;
const router = express.Router();

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
var app = express();
app.use(express.static(path.join(publicDir, 'public')));
app.use('/', router);

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
