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
exports.connectWS = void 0;
const chalk_1 = __importDefault(require("chalk"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const whatsapp_controller_1 = require("./whatsapp/whatsapp.controller");
let UsersConnected = [];
const connectWS = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(chalk_1.default.blue(`Nuevo usuario conectado, id: ${socket.id}`));
        try {
            const token = socket.handshake.auth.token;
            console.log(chalk_1.default.bgBlue(chalk_1.default.white(`token: ${token}`)));
            const { userID } = jsonwebtoken_1.default.verify(token, config_1.INITIAL_CONFIG.SECRET_KEY);
            AddUser(userID, socket.id);
            const initWsData = {
                userID,
                io: io,
                socket,
                wspInstance: undefined,
                wspConnState: 'close'
            };
            (0, whatsapp_controller_1.startWhatsappController)(initWsData);
        }
        catch (error) {
            console.log(error);
            console.log(chalk_1.default.red(error));
        }
        socket.on('disconnect', () => {
            const user = UsersConnected.find((e) => e.socketID === socket.id);
            if (user) {
                RemoveUser(user.userID);
            }
            console.log(chalk_1.default.red(`Usuario desconectado ${socket.id}`));
        });
    }));
};
exports.connectWS = connectWS;
const AddUser = (userID, socketID) => {
    const userFindedIndex = UsersConnected.findIndex((usr) => usr.userID === userID);
    if (userFindedIndex === -1) {
        UsersConnected.push({
            userID,
            socketID
        });
        return;
    }
    UsersConnected[userFindedIndex].socketID = socketID;
    return;
};
const RemoveUser = (userID) => {
    console.log('borrando usuario');
    UsersConnected = UsersConnected.filter((e) => e.userID !== userID);
};
