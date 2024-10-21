import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Note from './models/Note';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/MapoNote';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log(err));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// Create a new note
app.post('/notes/addNote', async (req: Request, res: Response) => {
    try {
        const { title, editorState } = req.body;
        const newNote = new Note({
            title,
            editorState
        });
        await newNote.save();
        res.status(201).send(newNote);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err.message);
          } else {
            console.error('Unknown error', err);
          }
    }
});

// Get all notes
app.get('/notes', async (req: Request, res: Response) => {
    try {
        const notes = await Note.find({});
        res.status(200).send(notes);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err.message);
          } else {
            console.error('Unknown error', err);
          }
    }
});

app.get('/notes/:noteId', async (req: Request, res: Response) => {
    try {
      const noteId = req.params.noteId;
      const note = await Note.findById(noteId);
  
      if (!note) {
        res.status(404).json({ message: 'Note not found' });
      }
  
      res.json(note);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
});

app.put('/notes/:noteId', async (req, res) => {
    const { noteId } = req.params;
    const { title, editorState } = req.body;

    try {
        // Find the note by ID and update it
        const updatedNote = await Note.findByIdAndUpdate(noteId, { title, editorState, updatedAt: Date.now() }, { new: true });

        if (!updatedNote) {
            res.status(404).send({ message: 'Note not found' });
        }

        res.status(200).send(updatedNote);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error updating the note' });
    }
});

// Set the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
