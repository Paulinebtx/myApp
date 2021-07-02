// lib and imports
const express = require("express");
const app = express();

const myFirstController = require("./controllers/controller")

// app setup
app.use(express.json())
app.use("/static", express.static("public"));
app.set("view engine", "ejs");


// pages
app.get('/',(req, res) => {
  res.render('home.ejs');
});

app.get('/activity',(req, res) => {
  res.render('activity.ejs');
});

//link send acticity to server
app.post('/api/activity/add', (req,res) => {
 console.log('from the brain')
 myFirstController.addActivityToDB(req.body)
})

app.post('/api/activity/all', (req, res) => {
  myFirstController.fetchAllActivityFromDb(res)
})

app.post('/api/activity/delete', (req, res) => {
  myFirstController.deleteActivityFromDB(req.body)
})




// app.get('/generic',(req, res) => {
//   res.render('generic.ejs');
// });

// app.get('/landing',(req, res) => {
//   res.render('landing.ejs');
// });

// app.get('/elements',(req, res) => {
//   res.render('elements.ejs');
// });



// Create here your api setup




app.listen(8000, () => console.log("Server Up and running"));
