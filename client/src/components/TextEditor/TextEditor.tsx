import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './TextEditor.css';


interface TextEditorProps {
    editorState: EditorState;
    setEditorState: (editorState: EditorState) => void;
}

const TextEditor : React.FC<TextEditorProps> = ({editorState, setEditorState}) => {
    const handleEditorChange = (state: EditorState) => {
        setEditorState(state);
    };

    return (
        <div className="editor-container">
            <Editor editorState={editorState} onChange={handleEditorChange} readOnly={false} />
        </div>
    );
};

export default TextEditor;