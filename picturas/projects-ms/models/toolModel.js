import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema(
  {
    position: {
      type: Number,
      required: true,
    },
    procedure: {
      type: String,
      required: true,
    },
    parameters: {
      type: String,
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'project',
      required: true,
    },
  },
  { versionKey: false }
);

const Tool = mongoose.model('project', toolSchema);

export { Tool as Project };
