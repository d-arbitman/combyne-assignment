import React from 'react';

class Notepad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isSaving: false,
      currentNoteId: '',
      currentNoteText: '',
      currentNoteTitle: '',
      currentError: '',
      noteList: []
    };

    this.updateDisplayedNote = this.updateDisplayedNote.bind(this);
  }

  /**
  * fetch all notes from backend
  */
  componentDidMount = () => {
    fetch("/api/notes").then(res => res.json()).then((result) => {
      this.setState({isLoaded: true, noteList: result.notes});
    }, (error) => {
      console.error(error);
    });
  }

  /**
  * onClick handler for note list LIs, changes state to that note
  * @param e event object
  */
  updateDisplayedNote = (e) => {
    e.preventDefault();
    const currentNote = this.state.noteList.filter(note => e.target.id === note.objectId)[0];
    this.setState({
      currentNoteId: currentNote.objectId,
      currentNoteText: currentNote.text,
      currentNoteTitle: currentNote.title}
    );
  }

  /**
  * onChange handler for title and text fields, updates state with changes
  * @param e event object
  */
  updateCurrentNote = (e) => {
    e.preventDefault();
    let newState = {currentError: ""};
    newState[e.target.id] = e.target.value;
    this.setState(newState);
  }

  /**
  * onClick handler for + button, changes ID, title and text to empty string
  * @param e event object
  */
  newNote = (e) => {
    e.preventDefault();
    this.setState({currentNoteId: '', currentNoteText: '', currentNoteTitle: ''});
  }

  /**
  * onClick handler for Save button, pushes new note fields to API
  * @param e event object
  */
  saveCurrentNote = (e) => {
    e.preventDefault();

    if (!this.state.currentNoteText || !this.state.currentNoteTitle) {
      // title or text are empty
      this.setState({currentError: 'Note title and text are required'})
    } else {

      // update state to disable title and text fields and save buttons while saving
      this.setState({currentError: '', isSaving: true});

      // set up arguments to POST to API
      const fetchArgs = {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify({
          title: this.state.currentNoteTitle,
          text: this.state.currentNoteText
        })
      };

      fetch('/api/note/' + this.state.currentNoteId, fetchArgs)
        .then(res => res.json())
        .then((response) => {
          if (!response.success) {
            // received a fail message from the API
            this.setState({currentError: response.message})
          } else {
            if (this.state.currentNoteId === '') {
              // this was a new note, append it to this.state.noteList array
              this.setState({
                currentNoteId: response.note.objectId,
                noteList: [...this.state.noteList, {
                    objectId: response.note.objectId,
                    title: this.state.currentNoteTitle,
                    text: this.state.currentNoteText
                  }],
                  isSaving: false
              });
            } else {
              // updated note, find correct one and update it
              let newNoteList = [];
              for(let i = 0; i < this.state.noteList.length; i++) {
                if(this.state.noteList[i].objectId === this.state.currentNoteId) {
                  newNoteList.push({
                    objectId: this.state.currentNoteId,
                    title: this.state.currentNoteTitle,
                    text: this.state.currentNoteText
                  });
                } else {
                  newNoteList.push(this.state.noteList[i]);
                }
              }
              this.setState({noteList: newNoteList, isSaving: false});
            }
          }
        });
    }
  }

  render() {
    return (<div className="Notepad-App">
      <div className="App-Header">
        <div className="Plus-Button">
          <button onClick={this.newNote}>+</button>
        </div>
        <div className="App-Title">
          <input type="text" name="currentNoteTitle" id="currentNoteTitle" value={this.state.currentNoteTitle} onChange={this.updateCurrentNote} disabled={this.state.isSaving} />
        </div>
      </div>
      <div className="Note-List">
        <ul>
          {this.state.noteList.map(
            note =>
            <li key={note.objectId} id={note.objectId}
              className={(note.objectId === this.state.currentNoteId) ? 'selected' : ''}
              onClick={this.updateDisplayedNote}>
              {(note.title.length > 40) ? note.title.substr(0, 25) + '...' : note.title}
            </li>
          )}
        </ul>
      </div>
      <div className="Note-Edit">
        {this.state.currentError && <div className="error">{this.state.currentError}</div>}
        <textarea name="Note-Edit-Textarea" id="currentNoteText" value={this.state.currentNoteText} onChange={this.updateCurrentNote} disabled={this.state.isSaving}></textarea>
        <div className="Note-Save-Button">
          <button onClick={this.saveCurrentNote} disabled={this.state.isSaving}>Save</button>
        </div>
      </div>
    </div>)
  }
}

export default Notepad;
