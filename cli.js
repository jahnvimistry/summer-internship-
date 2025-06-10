const { addNote, getAllNotes, getNoteById, deleteNoteById } = require('./notes');
const [,, cmd, ...args] = process.argv;

if (args.includes('--help')) {
  console.log(`
Commands:
  node cli.js add "title" "content"
  node cli.js list
  node cli.js view <id>
  node cli.js delete <id>
`);
  process.exit(0);
}

switch (cmd) {
  case 'add':
    const [title, content] = args;
    const newNote = addNote(title, content);
    console.log('Note added:', newNote);
    break;
  case 'list':
    console.log(getAllNotes());
    break;
  case 'view':
    const note = getNoteById(args[0]);
    console.log(note || 'Note not found');
    break;
  case 'delete':
    const success = deleteNoteById(args[0]);
    console.log(success ? 'Note deleted' : 'Note not found');
    break;
  default:
    console.log('Usage: add <title> <content> | list | view <id> | delete <id>');
}
