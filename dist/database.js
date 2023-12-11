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
exports.connectDB = void 0;
const mongoose_1 = require("mongoose");
const config_1 = require("./config");
const chalk_1 = __importDefault(require("chalk"));
let connectionState = 0;
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (connectionState === 1)
            return;
        const conn = yield (0, mongoose_1.connect)(config_1.INITIAL_CONFIG.MONGO_DB.path);
        connectionState = conn.connections[0].readyState;
    });
}
exports.connectDB = connectDB;
mongoose_1.connection.on('connected', () => {
    const message = chalk_1.default.green(`${config_1.INITIAL_CONFIG.MONGO_DB.production ? 'Production' : 'Developed'}`);
    console.log(`Connected to MongoDB on ${message}`);
});
mongoose_1.connection.on('error', (error) => {
    console.log(error);
    console.log(chalk_1.default.red(`Error connecting to MongoDB ${config_1.INITIAL_CONFIG.MONGO_DB.production ? 'on Production' : 'on Developed'}`));
});
