"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRouter = void 0;
const databases_controller_1 = require("../controllers/databases.controller");
const express_1 = require("express");
exports.DatabaseRouter = (0, express_1.Router)();
exports.DatabaseRouter.get('/getDatabases', databases_controller_1.getDatabases);
exports.DatabaseRouter.post('/createDatabase', databases_controller_1.createDatabase);
