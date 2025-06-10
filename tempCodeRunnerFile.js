const express = require('express');
const {
  addNote,
  getAllNotes,
  getNoteById,
  deleteNoteById
} = require('./notes');

const app = express();
const PORT = 3000;

app.use(express.json());

// 🟢 Get all notes
app.get('/notes', (req, res) => {
  res.json(getAllNotes());
});

// 🔵 Get a note by ID
app.get('/notes/:id', (req, res) => {
  const note = getNoteById(req.params.id);
  if (note) res.json(note);
  else res.status(404).json({ message: 'Note not found' });
});

// 🟡 Create a new note
app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  const newNote = addNote(title, content);
  res.status(201).json(newNote);
});

// 🔴 Delete a note by ID
app.delete('/notes/:id', (req, res) => {
  const success = deleteNoteById(req.params.id);
  if (success) res.json({ message: 'Note deleted' });
  else res.status(404).json({ message: 'Note not found' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
