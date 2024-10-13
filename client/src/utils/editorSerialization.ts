import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

export const toRawEditorState = (editorState: EditorState) => {
    return convertToRaw(editorState.getCurrentContent());
};

export const fromRawEditorState = (rawContent: any) => {
    try {
        return EditorState.createWithContent(convertFromRaw(rawContent));
    } catch (error) {
        console.error("Failed to convert raw content to EditorState:", error);
        return EditorState.createEmpty();
    }
};