import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    editorState: { 
        blocks: [Object],
        entityMap: {
            type: Map,
            of: Object,
            default: () => ({})
        }
     },
    createdAt: { type: Date, default: Date.now },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, minimize: false });

noteSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Create a model from the schema
const Note = mongoose.model('Notes', noteSchema);

export default Note;
