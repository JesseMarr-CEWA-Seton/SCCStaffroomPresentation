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


// This function is used to return true if a date has passed
function isDateBeforeToday(date) {
  if (date == "Invalid Date") {
    return false; // return false if invalid date entered
  } else {
    return new Date(date.toDateString()) < new Date(new Date().toDateString());
  }
}


// This function is used to copy the current JSON to the backup location
function backupJson() {
  // Copy file
  fs.copyFile('./content/StaffRoomPres/StaffRoomPres.json', './content/StaffRoomPres/StaffRoomPresBackup.json', (err) => {
    if (err) {
      console.log(err); // console log error if failed
    } else {
      console.log('file backed up'); // console log if successful
    }
  });
}


// This function is used to restore the used JSON from the backup file
function restoreJson() {
  // Copy file
  fs.copyFile('./content/StaffRoomPres/StaffRoomPresBackup.json', './content/StaffRoomPres/StaffRoomPres.json', (err) => {
    if (err) {
      console.log(err); // console log error if failed
    } else {
      console.log('file restored'); // console log if successful
    }
  });
}


// Used to check if used JSON file needs to be restored
function restoreJsonIfNeeded() {
  try {

    // Get json files info into var
    const jsonFileInfo = fs.statSync('./content/StaffRoomPres/StaffRoomPres.json');
    const jsonBackupFileInfo = fs.statSync('./content/StaffRoomPres/StaffRoomPresBackup.json');

    // extract the date of last edit
    jsonEditTime = jsonFileInfo.mtime;
    jsonBackupEditTime = jsonBackupFileInfo.mtime;

    if (jsonEditTime < jsonBackupEditTime) {
      restoreJson(); // Restore if backup is newer
    }

    // Read used JSON
    fs.readFile('./content/StaffRoomPres/StaffRoomPres.json', 'utf8', (err,data) => {
      if (data.length < 2) {
        restoreJson(); // If file has less then 2 char then restore from backup
      }
    });
    
  } catch (error) {
      console.log(error);
  }
}




//// Routes

// Default redirect
app.get('/', async (request, response) => {

  restoreJsonIfNeeded(); // Checks if restoration is needed
    
  // See if any entries are too old and need to be removed
  fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      
      // If file has 2 or more chars then continue to check JSON
      if (data.length >= 2) {

        obj = JSON.parse(data); // JSON into obj var

        // forEach entry in JSON
        var i = 0;
        obj.forEach(async function(element) {
          
          // If date of "ExpiryDate" is before current date
          if ((isDateBeforeToday(new Date(element.ExpiryDate))) || (element.Title == "")) {
            removed = obj.splice(i,1); // remove from obj

            // json to string
            var strRemainingNotices = JSON.stringify(obj);

            // write string to file
            fs.writeFile('content/StaffRoomPres/StaffRoomPres.json',strRemainingNotices, function(err){

              if(err) {
                console.log(err);  // output if error
               }

              // log that note has been deleted
              console.log('Note deleted');

              // if background exists
              if (removed[0].Background != 'blank') {

                // remove background
                fs.unlink('content/StaffRoomPres/backgrounds/' + removed[0].Background, (err) => {
                  if (err) {
                    console.error(err)
                  }
                });

              }

              // check json after writing
              fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', (err,data) => {

                // if json has data then backup ortherwise restore
                if (data.length >= 2) {
                  backupJson();
                } else {
                  restoreJson();
                }

              });

            }); // end writing json

          } else {
            i++; // increase i if entry does not need to be deleted
          }
        })
      }
    }
  });
  
  // Display slide show
  response.send( await readFile('./content/StaffRoomPres/index.html', 'utf8') );

}); // end default route


// route for main Json
app.get('/StaffRoomPres.json', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/StaffRoomPres.json', 'utf8') );

});


// route for main Json
app.get('/content/StaffRoomPres/backupJson.html', async (request, response) => {

  response.download("./content/StaffRoomPres/StaffRoomPres.json");

});


// route for backup json
app.get('/StaffRoomPresBackup.json', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/StaffRoomPresBackup.json', 'utf8') );

});


app.post('/content/StaffRoomPres/backup.html', upload.single('upload'), async (request, response) => {

  if ((request.file) && (request.body.Password == "NoticeMe!")) {
    if (request.file.mimetype == "application/json") {

      fs.rename(request.file.path, "./content/StaffRoomPres/StaffRoomPres.json", function(err) {
        if ( err ) console.log('ERROR: ' + err);
      });

      backupJson();

    }
  }

  // redirect to ./
  response.redirect('/');

});


// route for default background
app.get('/content/StaffRoomPres/background.jpg', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/background.jpg') );

});


// routes for all backgrounds
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
      ext = ".jpg";
      break;
    case "image/png":
      var newFileName = request.file.filename + ".jpg";
      ext = ".jpg";
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
      if (data.length >= 2) {
        obj = JSON.parse(data); //now it an object
        obj.push(newEntry);
        var strNotes = JSON.stringify(obj);
          fs.writeFile('content/StaffRoomPres/StaffRoomPres.json',strNotes, function(err){
              if(err) {
                console.log(err);
              }
              console.log('Note added');
              fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', (err,data) => {
                if (data.length >= 2) {
                  backupJson();
                } else {
                  restoreJson();
                }
              });
          });
      }
    }
  });

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
        if (data.length >= 2) {
          obj = JSON.parse(data); //now it an object

          if (requestIdDelete != 0) {
            removed = obj.splice(requestIdDelete - 1,1);

            var strNotes = JSON.stringify(obj);
              fs.writeFile('content/StaffRoomPres/StaffRoomPres.json',strNotes, function(err){
                if(err) {
                  console.log(err);
                }
                console.log('Note deleted');
                if (removed[0].Background != 'blank') {
                  fs.unlink('content/StaffRoomPres/backgrounds/' + removed[0].Background, (err) => {
                    if (err) {
                      console.error(err)
                    }
                  });
                }
                fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', (err,data) => {
                  if (data.length >= 2) {
                    backupJson();
                  } else {
                    restoreJson();
                  }
                });
            });
          }
        }
      }  
    });

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
          if (data.length >= 2) {
            obj = JSON.parse(data); //now it an object

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
                      if(err) {
                        console.log(err);
                      }
                      console.log('Note moved');
                      fs.readFile('content/StaffRoomPres/StaffRoomPres.json', 'utf8', (err,data) => {
                        if (data.length >= 2) {
                          backupJson();
                        } else {
                          restoreJson();
                        }
                      });
                  });

                }
        
      }
        
        
    });
   

}


response.send( await readFile('./content/StaffRoomPres/ReorderEntries.html', 'utf8') );

});



//// Redirects for "/content/StaffRoomPres/backup.html"
app.get('/content/StaffRoomPres/backup.html', async (request, response) => {

  response.send( await readFile('./content/StaffRoomPres/backup.html', 'utf8') );

});









app.listen(process.env.PORT || 3000, () => console.log(`App available on http://localhost:80`))