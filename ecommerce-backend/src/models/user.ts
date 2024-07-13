import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: 'admin' | 'user';
    gender: 'male' | 'female';
    dob: Date;
    createdAt: Date;
    updatedAt: Date;
    age: number;
}


const schema = new mongoose.Schema(
	{
		_id : {
            type: String,
            required: [true, 'Please provide a user id']
        },
        name: {
            type: String,
            required: [true, 'Please provide a user name']
        },
        email: {
            type: String,
            required: [true, 'Please provide a user email'],
            unique: [true, 'Email already exists'],
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        photo: {
            type: String,
            required: [true, 'Please provide a user photo']
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: [true, 'Please enter gender']
        },
        dob:{
            type: Date,
            required: [true, 'Please enter date of birth']
        },
	},
	{
		timestamps: true,
	}
);

schema.virtual("age").get(function() {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();

    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});

export const User = mongoose.model<IUser>("User", schema);
