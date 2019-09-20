'use strict';

const fs = require('fs');
const notes = require('./controllers/notepad');

module.exports = function(app) {

  app.route('/api')
    .get((req, res) => {
      res.json({"success": false, "message": "Unknown endpoint"});
    });

  // get all notes
  app.route('/api/notes')
     .get(notes.list_notes);

  // get note by objectId
  app.route('/api/note/:note_id')
     .get(notes.get_note)
     .post(notes.save_note);

  // save note
  app.route('/api/note')
     .post(notes.save_note);

  app.use((req, res) => {
    res.sendFile(__dirname + '/notepad/build/' + req.url);
  });
}
