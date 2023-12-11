"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserToken = exports.registerUser = exports.LoginUser = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const User = yield user_model_1.UserModel.findOne({ email: data.email });
    if (!User)
        return res.status(400).json({ message: 'Usuario no encontrado' });
    try {
        const passwordCompared = yield user_model_1.UserModel.comparePassword(data.password, User.password);
        if (passwordCompared) {
            const token = jsonwebtoken_1.default.sign({ userID: User.id }, config_1.INITIAL_CONFIG.SECRET_KEY, {
                expiresIn: '10 hrs'
                // expiresIn: '5s'
            });
            return res.json({
                user: {
                    _id: User._id,
                    name: User.name,
                    email: User.email,
                    gender: User.gender
                },
                token
            });
        }
        return res.status(500).json({ message: 'error perrito' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Hubo un error gg'
        });
    }
});
exports.LoginUser = LoginUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    console.log(userData);
    try {
        const newUser = new user_model_1.UserModel(userData);
        const newUserSaved = yield newUser.save();
        return res.json({ userSaved: newUserSaved, message: 'usuario guardado' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'usuario no guardado :v' });
    }
});
exports.registerUser = registerUser;
const verifyUserToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token)
        return res.status(500).json({ message: 'No se envió el token' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.INITIAL_CONFIG.SECRET_KEY);
        const user = yield user_model_1.UserModel.findById(decoded.userID).select([
            '_id',
            'name',
            'gender',
            'email'
        ]);
        return res.json({ user });
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ valid: false });
    }
});
exports.verifyUserToken = verifyUserToken;
