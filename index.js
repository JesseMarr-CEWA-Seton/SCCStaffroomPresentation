const express = require('express');
const app = express();
const { readFile } = require('fs').promises;
const bodyParser = require("body-parser");
const fs = require("fs");


app.use(bodyParser.urlencoded({
  extended: true
}));


// Default redirect
app.get('/', async (request, response) => {

    response.send( await readFile('./content/StaffRoomPres/index.html', 'utf8') );

});



////////
////    Redirects for "/content/StaffRoomPres"
////////


//// Redirects for "/content/StaffRoomPres/index.html"

app.get('/data.json', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/data.json', 'utf8') );

});

app.get('/test.json', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/test.json', 'utf8') );

});

app.get('/content/StaffRoomPres/background.jpg', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/background.jpg') );

});



//// Redirects for "/content/StaffRoomPres/RemoveOldEntries.html"
app.get('/content/StaffRoomPres/RemoveOldEntries.html', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/RemoveOldEntries.html', 'utf8') );

});

app.post('/content/StaffRoomPres/RemoveOldEntries.html', async (request, response) => {

  console.log(request.body.Title);
  console.log(request.body.Message);
  console.log(request.body.ExpiryDate);

  var obj = {
    data: []
 };

 var newEntry = {"Title": request.body.Title, "Message":request.body.Message};

  fs.readFile('content/StaffRoomPres/test.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data); //now it an object
      obj.push(newEntry);
      var strNotes = JSON.stringify(obj);
            fs.writeFile('content/StaffRoomPres/test.json',strNotes, function(err){
                if(err) return console.log(err);
                console.log('Note added');
            });
  }});

  response.send( await readFile('./content/StaffRoomPres/RemoveOldEntries.html', 'utf8') );

});


app.listen(process.env.PORT || 3000, () => console.log(`App available on http://localhost:3000`))