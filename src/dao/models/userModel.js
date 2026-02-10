import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userCollection = "users";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    role: {
        type: String,
        required: true,
        default: "user"
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
