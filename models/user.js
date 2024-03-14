import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // todos: [
  //   {
  //     type: String,
  //     ref: 'Todo',
  //   },
  // ],
});

const User = mongoose.model('User', userSchema);

export default User;
