"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageModel = void 0;
const mongoose_1 = require("mongoose");
const messageModelSchema = new mongoose_1.Schema({
    userID: String,
    name: String,
    message: String
});
exports.messageModel = (0, mongoose_1.model)('messageModel', messageModelSchema);
