"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModelRouter = void 0;
const messageModel_controller_1 = require("../controllers/messageModel.controller");
const express_1 = require("express");
exports.MessageModelRouter = (0, express_1.Router)();
exports.MessageModelRouter.get('/messageModels', messageModel_controller_1.getMessageModels);
exports.MessageModelRouter.post('/createMessageModels', messageModel_controller_1.createMessageModels);
