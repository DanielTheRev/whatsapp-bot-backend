"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModel = void 0;
const mongoose_1 = require("mongoose");
const databaseSchema = new mongoose_1.Schema({
    userID: String,
    nombre: String,
    data: [{}]
});
exports.DatabaseModel = (0, mongoose_1.model)('Database', databaseSchema);
