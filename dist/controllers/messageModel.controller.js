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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageModels = exports.getMessageModels = void 0;
const messageModel_model_1 = require("../models/messageModel.model");
const getMessageModels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.query.userID;
    const data = yield messageModel_model_1.messageModel.find({ userID: userID });
    return res.json(data);
});
exports.getMessageModels = getMessageModels;
const createMessageModels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const newMessageModel = new messageModel_model_1.messageModel(data);
    const newMessageModelSaved = yield newMessageModel.save();
    return res.json({ newMessageModelSaved });
});
exports.createMessageModels = createMessageModels;
