import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { IUser, IUserModel } from '../interfaces/user.interface';

const UserSchema = new Schema<IUser>(
	{
		name: String,
		email: String,
		gender: String,
		password: String
	},
	{
		versionKey: false,
		timestamps: true
	}
);

UserSchema.statics.encryptPassword = async (Password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(Password, salt);
};

UserSchema.statics.comparePassword = async (password, receivedPassword) => {
	return await bcrypt.compare(password, receivedPassword);
};

UserSchema.pre('save', async function (next) {
	const user = this;
	if (!user.isModified('password')) {
		return next();
	}
	const hash = await bcrypt.hash(user.password!, 10);
	user.password = hash;
	next();
});

export const UserModel = model<IUser, IUserModel>('user', UserSchema);
