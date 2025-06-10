const fs = require('fs');
const path = require('path');

const notesFile = path.join(__dirname, 'notes.json');

function readNotes() {
  if (!fs.existsSync(notesFile)) return [];
  const data = fs.readFileSync(notesFile);
  return JSON.parse(data);
}

function writeNotes(notes) {
  fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
}

function addNote(title, content) {
  const notes = readNotes();
  const newNote = {
    id: Date.now().toString(),
    title,
    content
  };
  notes.push(newNote);
  writeNotes(notes);
  return newNote;
}

function getAllNotes() {
  return readNotes();
}

function getNoteById(id) {
  const notes = readNotes();
  return notes.find(note => note.id === id);
}

function deleteNoteById(id) {
  const notes = readNotes();
  const index = notes.findIndex(note => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    writeNotes(notes);
    return true;
  }
  return false;
}

module.exports = {
  addNote,
  getAllNotes,
  getNoteById,
  deleteNoteById
};
