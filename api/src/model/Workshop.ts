import mongoose, { Schema, Document } from "mongoose";
// interface
export interface IWorkshop extends Document {
  name: string;
  description: string;
  s3id: string;
  createdAt: Date;
  mentor: string;
  mentees: string[]; // Change from single mentee to array of mentees
}

// workshop schema
const WorkshopSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  s3id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  mentor: { type: String, required: true },
  mentees: [{ type: String }], // Array of mentee IDs
});

// update text content of the workshop
// TODO: is this needed ???
WorkshopSchema.methods.updateContent = async function (
  newContent: string,
): Promise<void> {
  this.textContent = newContent;
  await this.save();
};
// mongoose model
export const Workshop = mongoose.model<IWorkshop>("Workshop", WorkshopSchema);
