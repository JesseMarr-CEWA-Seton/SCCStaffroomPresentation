const express = require('express');
const app = express();
const { readFile } = require('fs').promises;
const bodyParser = require("body-parser");
const fs = require("fs");


app.use(bodyParser.urlencoded({
  extended: true
}));

function isDateBeforeToday(date) {
  return new Date(date.toDateString()) < new Date(new Date().toDateString());
}


// Default redirect
app.get('/', async (request, response) => {

    
  // Remove old entries
  fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object

    var i = 0;
    obj.forEach(async function(element) {
      
      
      if ((isDateBeforeToday(new Date(element.ExpiryDate))) || (element.Title == "")) {
        removed = obj.splice(i,1);

        var strNotes = JSON.stringify(obj);
            fs.writeFile('content/StaffRoomPres/StaffRoomPres.json',strNotes, function(err){
                if(err) return console.log(err);
                console.log('Note deleted');
            });
      } else {
        i++;
      }
    })


  }});
  
  
  response.send( await readFile('./content/StaffRoomPres/index.html', 'utf8') );

});










////////
////    Redirects for "/content/StaffRoomPres"
////////


//// Redirects for "/content/StaffRoomPres/index.html"

app.get('/StaffRoomPres.json', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/StaffRoomPres.json', 'utf8') );

});

app.get('/content/StaffRoomPres/background.jpg', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/background.jpg') );

});








//// Redirects for "/content/StaffRoomPres/RemoveOldEntries.html"
app.get('/content/StaffRoomPres/RemoveOldEntries.html', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/RemoveOldEntries.html', 'utf8') );

});

app.post('/content/StaffRoomPres/AddNewEntries.html', async (request, response) => {

  var obj = {
    data: []
 };

 var newEntry = {"Title": request.body.Title, "Message":request.body.Message, "ExpiryDate":request.body.ExpiryDate};

  fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data); //now it an object
      obj.push(newEntry);
      var strNotes = JSON.stringify(obj);
            fs.writeFile('content/StaffRoomPres/StaffRoomPres.json',strNotes, function(err){
                if(err) return console.log(err);
                console.log('Note added');
            });
  }});

  response.send( await readFile('./content/StaffRoomPres/AddNewEntries.html', 'utf8') );

});


//// Redirects for "/content/StaffRoomPres/AddNewEntries.html"
app.get('/content/StaffRoomPres/AddNewEntries.html', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/AddNewEntries.html', 'utf8') );

});


app.post('/content/StaffRoomPres/RemoveOldEntries.html', async (request, response) => {

  var requestIdDelete = request.body.SlideId;

  fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data); //now it an object


      if (requestIdDelete != 0) {
        removed = obj.splice(requestIdDelete - 1,1);

        var strNotes = JSON.stringify(obj);
            fs.writeFile('content/StaffRoomPres/StaffRoomPres.json',strNotes, function(err){
                if(err) return console.log(err);
                console.log('Note deleted');
            });
      }
      
  }});


  response.send( await readFile('./content/StaffRoomPres/RemoveOldEntries.html', 'utf8') );

});















app.listen(process.env.PORT || 80, () => console.log(`App available on http://localhost:80`))