const express = require('express');
const app = express();
const { readFile } = require('fs').promises;
const bodyParser = require("body-parser");
const fs = require("fs");
const multer  = require('multer')
const upload = multer({ dest: 'content/StaffRoomPres/backgrounds/' })


app.use(bodyParser.urlencoded({
  extended: true
}));

function isDateBeforeToday(date) {
  return new Date(date.toDateString()) < new Date(new Date().toDateString());
}


function backupJson() {
  fs.copyFile('./content/StaffRoomPres/StaffRoomPres.json', './content/StaffRoomPres/StaffRoomPresBackup.json', (err) => {
    if (err) throw err;
    console.log('file backed up');
  });
}

function restoreJson() {
  fs.copyFile('./content/StaffRoomPres/StaffRoomPresBackup.json', './content/StaffRoomPres/StaffRoomPres.json', (err) => {
    if (err) console.log(err);
    console.log('file restored');
  });
}

function restoreJsonIfNeeded() {
  try {
    const jsonFileInfo = fs.statSync('./content/StaffRoomPres/StaffRoomPres.json');
    const jsonBackupFileInfo = fs.statSync('./content/StaffRoomPres/StaffRoomPresBackup.json');

    jsonEditTime = jsonFileInfo.mtime;
    jsonBackupEditTime = jsonBackupFileInfo.mtime;
    if (jsonEditTime < jsonBackupEditTime) {
      restoreJson();
    }

    fs.readFile('./content/StaffRoomPres/StaffRoomPres.json', 'utf8', (err,data) => {
      if (data.length < 2) {
        restoreJson();
      }
    });
    
  } catch (error) {
      console.log(error);
  }
}



// Default redirect
app.get('/', async (request, response) => {

  restoreJsonIfNeeded();
    
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
                if (removed[0].Background != 'blank') {
                  fs.unlink('content/StaffRoomPres/backgrounds/' + removed[0].Background, (err) => {
                    if (err) {
                      console.error(err)
                      return
                    }
                  });
                }
                fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', (err,data) => {
                  if (data.length > 0) {
                    backupJson();
                  } else {
                    restoreJson();
                  }
                });
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

app.get('/StaffRoomPresBackup.json', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/StaffRoomPresBackup.json', 'utf8') );

});

app.get('/content/StaffRoomPres/background.jpg', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/background.jpg') );

});

app.get('/content/StaffRoomPres/backgrounds/*', async (request, response) => {

  response.send( await readFile("./" + request.originalUrl) );

});








//// Redirects for "/content/StaffRoomPres/RemoveEntries.html"
app.get('/content/StaffRoomPres/RemoveEntries.html', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/RemoveEntries.html', 'utf8') );

});

app.post('/content/StaffRoomPres/AddNewEntries.html', upload.single('background'), async (request, response) => {

  var obj = {
    data: []
 };

 var ext = "";
 var newFileName = "blank";


 if (request.file) {
  switch (request.file.mimetype) {
    case "image/jpeg":
      var newFileName = request.file.filename + ".jpg";
      break;
    case "image/png":
      var newFileName = request.file.filename + ".jpg";
      break;
  }
 }

  var message = request.body.Message;
  var breaks = message.search("\r\n");
  while(breaks != -1) {
    message = message.replace("\r\n", "<br>");
    breaks = message.search("\r\n");
  }

 var newEntry = {"Title": request.body.Title, "Message":message, "ExpiryDate":request.body.ExpiryDate, "Background":newFileName};

 if (request.body.Password == "NoticeMe!") {

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
              fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', (err,data) => {
                if (data.length > 0) {
                  backupJson();
                } else {
                  restoreJson();
                }
              });
          });
  }});

  if (newFileName != "blank") {
    fs.rename(request.file.path, request.file.path + ext, function(err) {
      if ( err ) console.log('ERROR: ' + err);
    });
  }

 } else {
  if (request.file) {
    fs.unlink(request.file.path, (err) => {
      if ( err ) console.log('ERROR: ' + err);
    });
  }

 }

  response.redirect('/');

});


//// Redirects for "/content/StaffRoomPres/AddNewEntries.html"
app.get('/content/StaffRoomPres/AddNewEntries.html', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/AddNewEntries.html', 'utf8') );

});


app.post('/content/StaffRoomPres/RemoveEntries.html', async (request, response) => {

  var requestIdDelete = request.body.SlideId;

  if (request.body.Password == "NoticeMe!") {

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
                  if (removed[0].Background != 'blank') {
                    fs.unlink('content/StaffRoomPres/backgrounds/' + removed[0].Background, (err) => {
                      if (err) {
                        console.error(err)
                        return
                      }
                    });
                  }
                  fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', (err,data) => {
                    if (data.length > 0) {
                      backupJson();
                    } else {
                      restoreJson();
                    }
                  });
              });
        }
        
    }});

}


  response.redirect('/');

});



//// Redirects for "/content/StaffRoomPres/AddNewEntries.html"
app.get('/content/StaffRoomPres/ReorderEntries.html', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/ReorderEntries.html', 'utf8') );

});


app.post('/content/StaffRoomPres/ReorderEntries.html', async (request, response) => {

  var requestIdMove = request.body.SlideId;
  var requestMoveTo = request.body.MoveTo;
  var i = 0;



  if ((request.body.Password == "NoticeMe!") && (requestIdMove != requestMoveTo) && (requestIdMove != 0) && (requestMoveTo != 0)) {

    fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object

        //


        if (requestMoveTo == "Front") {
          console.log('Move forward');
          
          movedObj = obj.splice(requestIdMove - 1,1);
          var newEntry = {"Title": movedObj[0].Title, "Message":movedObj[0].Message, "ExpiryDate":movedObj[0].ExpiryDate, "Background":movedObj[0].Background};
          obj.unshift(newEntry);

        }

        if (requestMoveTo == "Back") {
          console.log('Move back');

          movedObj = obj.splice(requestIdMove - 1,1);
          var newEntry = {"Title": movedObj[0].Title, "Message":movedObj[0].Message, "ExpiryDate":movedObj[0].ExpiryDate, "Background":movedObj[0].Background};
          obj.push(newEntry);

        }
          
          var strNotes = JSON.stringify(obj);
              fs.writeFile('content/StaffRoomPres/StaffRoomPres.json',strNotes, function(err){
                  if(err) return console.log(err);
                  console.log('Note moved');
                  fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', (err,data) => {
                    if (data.length > 0) {
                      backupJson();
                    } else {
                      restoreJson();
                    }
                  });
              });


        }
        
        
    });
   

}


response.send( await readFile('./content/StaffRoomPres/ReorderEntries.html', 'utf8') );

});













app.listen(process.env.PORT || 3000, () => console.log(`App available on http://localhost:80`))