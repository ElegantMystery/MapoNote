import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../hooks';
import { fetchNotes, setActiveNote, setEditorState, saveNote, loadNote } from './NotesSlice';
import TextEditor from '../TextEditor/TextEditor';
import { RootState } from '../../store';
import { EditorState } from 'draft-js';
import './Notes.css';
import { Before } from 'v8';

  
const NotesContainer: React.FC = () => {
  const { notes, activeNote, status, error } = useSelector((state: RootState) => state.notes);
  const [localEditorState, setLocalEditorState] = useState(EditorState.createEmpty());
  const [unsavedChanges, setUnSavedChanges] = useState<{ [key: string]: boolean}>({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === 'idle') {
        dispatch(fetchNotes());
    }
  }, [status, dispatch]);

  useEffect(() => {
    // When activeNote changes, update localEditorState from Redux store or set to empty
    const note = notes.find(n => n.id === activeNote);
    if (note) {
      setLocalEditorState(note.editorState);
    } else {
      setLocalEditorState(EditorState.createEmpty());
    }
  }, [activeNote, notes]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (Object.values(unsavedChanges).some(isUnsaved => isUnsaved)) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes'
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [unsavedChanges]);

  const handleTabClick = (noteId: string) => {
    if (noteId !== activeNote) {
      dispatch(setEditorState({ noteId: activeNote, editorState: localEditorState }));
      dispatch(setActiveNote(noteId));
      handleSaveClick();
    }
  };

  const handleSaveClick = () => {
    const noteData = {
      id: activeNote as string,
      title : notes.find(note => note.id === activeNote)?.title as string,
      editorState: localEditorState
    };
    dispatch(saveNote(noteData));
    setUnSavedChanges(prev => ({ ...prev, [activeNote as string]: false}));
  }

  if (status === 'loading') return <p>Loading notes...</p>;
  if (error) return <p>Error loading notes: {error}</p>;

  const handleEditorChange = (newState: EditorState) => {
    setLocalEditorState(newState);
    if (activeNote) {
      setUnSavedChanges(prev => ({ ...prev, [activeNote]: true}));
    }
  };


  console.log("Active Note:", activeNote);

  return (
    <div className="note-container">
      <section>
        <div className="note-tabs note-border">
          <ul className="note-tabs-ul">
            {notes.map(note => (
              <li key={note.id}
                  className={`note-tabs-li ${activeNote === note.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(note.id)}>
                  {note.title}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="note-content note-border">
        <button onClick={handleSaveClick}>Save</button>
        <TextEditor
          editorState={localEditorState}
          setEditorState={handleEditorChange}
        />
      </div>
    </div>
  );
};
export default NotesContainer;
