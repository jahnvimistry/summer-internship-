const express = require('express');
const path = require('path');
const fs = require('fs');
const {
  addNote,
  getAllNotes,
  getNoteById,
  deleteNoteById
} = require('./notes');

const app = express();
const PORT = 3000;

app.use(express.json());

// Logging middleware for all routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  console.log('Request URL:', req.url);
  next();
});

const staticPath = path.join(__dirname, 'public');
console.log('Static files served from:', staticPath);
app.use(express.static(staticPath));

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.get('/notes', (req, res) => {
  res.json(getAllNotes());
});

app.get('/notes/:id', (req, res) => {
  const note = getNoteById(req.params.id);
  if (note) res.json(note);
  else res.status(404).json({ message: 'Note not found' });
});

app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  const newNote = addNote(title, content);
  res.status(201).json(newNote);
});

app.put('/notes/:id', (req, res) => {
  const notes = getAllNotes();
  const index = notes.findIndex(note => note.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Note not found' });

  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Missing fields' });

  notes[index] = { id: notes[index].id, title, content };
  fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
  res.json(notes[index]);
});

app.delete('/notes/:id', (req, res) => {
  const success = deleteNoteById(req.params.id);
  if (success) res.json({ message: 'Note deleted' });
  else res.status(404).json({ message: 'Note not found' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
