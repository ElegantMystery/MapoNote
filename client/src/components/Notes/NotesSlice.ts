import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from 'axios';
import { EditorState, RawDraftContentState } from "draft-js";
import { fromRawEditorState, toRawEditorState } from "../../utils/editorSerialization";

interface Note {
    id: string;
    title: string;
    editorState: EditorState;
}

interface NoteState {
    notes: Note[];
    activeNote: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}


const initialState: NoteState = {
    notes: [],
    activeNote: null,
    status: 'idle',
    error: null
};


export const fetchNotes = createAsyncThunk('fetchNotes', async (args, { getState, rejectWithValue}) => {
    try {
        const response = await axios.get('http://localhost:5000/notes');
        const notes = response.data.map((note: any) => ({
            ...note,
            editorState: fromRawEditorState(note.editorState)
        }));
        return notes;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            // Handling Axios errors specifically
            return rejectWithValue(error.response?.data);
        }
        // Generic error handling
        return rejectWithValue('An unknown error occurred');
    }
});

export const addNote = createAsyncThunk(
    'addNote',
    async (noteData: { title: string, editorState: RawDraftContentState }, { rejectWithValue }) => {
        try {
            const preparedData = {
                ...noteData,
                editorState: noteData.editorState
            };
            const response = await axios.post('http://localhost:5000/notes/addNote', preparedData);
            return {
                ...response.data,
                editorState: fromRawEditorState(response.data.editorState)
            };
        } catch (error) {
            return rejectWithValue("Failed to add note");
        }
    }
);

export const saveNote = createAsyncThunk(
    'notes/save',
    async (noteData: Note, { rejectWithValue }) => {
      const { id, title, editorState } = noteData;
      const rawContent = toRawEditorState(editorState);
  
      const payload = {
        title,
        editorState: rawContent
      };
  
      try {
        let response;
        if (id) {
          // If noteId is present, update the existing note
          response = await axios.put(`http://localhost:5000/notes/${id}`, payload);
        } else {
          // If no noteId, create a new note
          response = await axios.post('http://localhost:5000/notes', payload);
        }
        return response.data;
      } catch (error) {
        return rejectWithValue("Failed to save note");
      }
    }
  );
  
export const loadNote = createAsyncThunk('notes/load', async (noteId, { rejectWithValue }) => {
try {
    const response = await axios.get(`/notes/${noteId}`);
    return fromRawEditorState(response.data.content);
} catch (error) {
    return rejectWithValue("Failed to load note");
}
});

export const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        setActiveNote: (state, action: PayloadAction<string>) => {
            state.activeNote = action.payload;
        },
        setEditorState: (state, action: PayloadAction<{ noteId: string | null; editorState: EditorState }>) => {
            const { noteId, editorState } = action.payload;
            const note = state.notes.find(n => n.id === noteId);
            if (note) {
                note.editorState = editorState;

            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notes = action.payload;  // Assuming the payload is the array of notes
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(addNote.fulfilled, (state, action) => {
                state.notes.push(action.payload);  // Add the new note to the state
            });
    }
});

export const { setActiveNote, setEditorState } = notesSlice.actions;

export default notesSlice.reducer;