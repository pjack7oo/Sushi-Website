const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const router = express.Router();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/main2.html'));
  //__dirname : It will resolve to your project folder.
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use('/', router)
  
  
  //.get('/', (req, res) => res.render('main2.html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))







// var app = express();

// const publicDir = path.join(__dirname, 'public');

// app.use(express.static(publicDir));





// app.use('/', router);
// //const port = process.env.PORT || 3030;


// // // app.get('/', function(req,res) {
// // //   res.render('./main2.html');
// // // });

// app.listen(PORT);
