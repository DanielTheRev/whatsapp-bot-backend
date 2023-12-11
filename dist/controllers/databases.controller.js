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
exports.createDatabase = exports.getDatabases = void 0;
const database_model_1 = require("../models/database.model");
const getDatabases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const data = yield database_model_1.DatabaseModel.find({ userID: query.userID });
    console.log(req.query);
    return res.json(data);
});
exports.getDatabases = getDatabases;
const createDatabase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const newDatabase = new database_model_1.DatabaseModel(data);
    const newDatabaseSaved = yield newDatabase.save();
    return res.json({ newDatabaseSaved });
});
exports.createDatabase = createDatabase;
