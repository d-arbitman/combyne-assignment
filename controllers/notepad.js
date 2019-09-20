const fs = require('fs');
const Parse = require('parse/node');
Parse.initialize("notepad");
Parse.serverURL = process.env.MONGO_SERVER_URL;
const Note = Parse.Object.extend("Note");

// find all notes, return them to the front end
exports.list_notes = (req, res) => {
  const query = new Parse.Query(Note);
  query.find().then((notes) => {
    res.json({"success": true, notes});
  }, (error) => {
    res.json({"success": false, "messsage": error});
  });

}

// find single note by objectId
exports.get_note = (req, res) => {
  const query = new Parse.Query(Note);
  query.equalTo("objectId", req.params.note_id);
  query.first().then((note) => {
    if(note) {
      res.json({"success": true, "note": note});
    } else {
      res.json({"success": false, "message": "Note not found"});
    }
  }, (error) => {
    res.json({"success": false, "message": error});
  });
}

// save note to MongoDB through Parse-Server
exports.save_note = (req, res) => {
  const ret = {
    "success": false,
    "message": "An unknown error has occurred"
  };

  if (req.params.note_id) {
    // this is an update
    const query = new Parse.Query(Note);

    query.get(req.params.note_id).then(note => {
      if (note) {
        note.set("title", req.body.title);
        note.set("text", req.body.text);
        note.save()
          .then((n) => {
            res.json({success: true, note: n});
          });
      } else {
        res.json({success: false, message: 'Could not find note'});
      }
     });
  } else {
    // this is a new note
    let note = new Note();
    note.set("title", req.body.title);
    note.set("text", req.body.text);
    note.save()
      .then((n) => {
        res.json({success: true, note: n});
      });
  }
}
