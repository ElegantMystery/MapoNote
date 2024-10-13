import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from '../../hooks';
import { addNote } from '../Notes/NotesSlice';
import { EditorState } from 'draft-js';
import { toRawEditorState } from '../../utils/editorSerialization';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();

    const handleAddNote = () => {
        const newEditorState = EditorState.createEmpty();
        const rawEditorState = toRawEditorState(newEditorState);
        
        dispatch(addNote({
            title: 'new Note',
            editorState: rawEditorState
        }));
    }

    return (
        <div className="sidebar">
            <ul>
                <li><button onClick={handleAddNote}>Add new Note</button></li>
                <li><Link to="/">Link 1</Link></li>
                <li><Link to="/notes">Notes</Link></li>
            </ul>
        </div>
    )
}

export default Sidebar;