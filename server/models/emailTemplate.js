import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  template: {
    type: Object,
    required: true,
  },
});

export default mongoose.model("EmailTemplate", templateSchema);
