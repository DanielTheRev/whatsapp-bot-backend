"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const authentication_controller_1 = require("../controllers/authentication.controller");
const express_1 = require("express");
exports.AuthRouter = (0, express_1.Router)();
exports.AuthRouter.post('/login', authentication_controller_1.LoginUser);
exports.AuthRouter.post('/register', authentication_controller_1.registerUser);
exports.AuthRouter.post('/verifyToken', authentication_controller_1.verifyUserToken);
