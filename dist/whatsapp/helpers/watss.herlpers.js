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
exports.getDayStatus = exports.fileAuthState = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const baileys_1 = require("@whiskeysockets/baileys");
const fileAuthState = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = `${path_1.default.join(__dirname, '../auth', `${userID}`)}`;
    try {
        yield promises_1.default.mkdir(filePath);
    }
    catch (error) {
        console.log(`La carpeta del usuario ${userID} para Auth ya ha sido creada.`);
    }
    return yield (0, baileys_1.useMultiFileAuthState)(filePath);
});
exports.fileAuthState = fileAuthState;
function getDayStatus() {
    const date = new Date();
    const hour = date.getHours();
    let saludo = '';
    if (hour >= 0 && hour < 12) {
        saludo = 'Buenos días';
    }
    else if (hour >= 12 && hour < 18) {
        saludo = 'Buenas tardes';
    }
    else {
        saludo = 'Buenas noches';
    }
    return saludo;
}
exports.getDayStatus = getDayStatus;
