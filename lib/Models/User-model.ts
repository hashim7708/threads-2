import mongoose from "mongoose";


const useSchema = new mongoose.Schema({
  id: { type: String, require: true },
  name: { type: String, require: true },
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  image: { type: String },
  bio: { type: String },
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "threads" }],
  onboarding: { type: Boolean, default: false },
  community: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});
const User = mongoose.models.User || mongoose.model("User", useSchema);
export default User;
