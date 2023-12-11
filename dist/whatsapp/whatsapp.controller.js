"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserWspState = exports.updateUserSocketID = exports.updateUserWsp = exports.getOrCreateUser = exports.addUser = exports.startWhatsappController = exports.UserTask = exports.userWspController = void 0;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const watss_herlpers_1 = require("./helpers/watss.herlpers");
const chalk_1 = __importDefault(require("chalk"));
const database_model_1 = require("../models/database.model");
const messageModel_model_1 = require("../models/messageModel.model");
exports.userWspController = [];
exports.UserTask = [];
const startWhatsappController = (data) => {
    console.log(`starting whatsapp controller to userID: ${data.userID}`);
    let wspUser = (0, exports.getOrCreateUser)(data);
    (0, exports.updateUserSocketID)(wspUser.userID, data.socket);
    wspUser = Object.assign(Object.assign({}, data), { wspConnState: wspUser.wspConnState });
    WspInstance(wspUser);
    console.log({
        userID: data.userID,
        socketID: data.socket.id,
        connectionState: data.wspConnState
    });
    data.socket.on('whatsapp-connection-connect', () => {
        console.log('connection-connect');
        createWspInstance(data);
    });
    const tasksUser = exports.UserTask.find((e) => e.userID === wspUser.userID);
    data.io.to(data.socket.id).emit('get-task-user', { tasks: (tasksUser === null || tasksUser === void 0 ? void 0 : tasksUser.tasks) || [] });
    data.socket.on('create-task', (data, cb) => __awaiter(void 0, void 0, void 0, function* () {
        const database = yield database_model_1.DatabaseModel.findById(data.Database._id);
        const MessageModelSelected = yield messageModel_model_1.messageModel.findById(data.MessageModel._id);
        if (!database)
            return cb({ success: false, message: 'no existe esa base de datos' });
        if (!MessageModelSelected)
            return cb({ success: false, message: 'no existe ese modelo' });
        const newTask = {
            _id: crypto.randomUUID(),
            state: 'Esperando',
            cantidad_mensajes: database.data.length,
            progress: 0,
            modelo_mensaje: data.MessageModel,
            base_de_datos: data.Database
        };
        const user_tasks_idx = exports.UserTask.findIndex((e) => e.userID === wspUser.userID);
        if (user_tasks_idx === -1) {
            const newTaskUser = {
                userID: wspUser.userID,
                tasks: [newTask]
            };
            exports.UserTask.push(newTaskUser);
            return cb(newTask);
        }
        exports.UserTask[user_tasks_idx].tasks.push(newTask);
        return cb(newTask);
        // const messages: any[] = [];
        // const rawMessage = MessageModelSelected.message ;
        // database.data.forEach((cliente) => {
        // 	const message = rawMessage.replace(/\$(\w+)/g, (_, variable) => {
        // 		return cliente[variable];
        // 	});
        // 	messages.push(message);
        // });
    }));
    data.socket.on('task: send-messages', (task, cb) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        var _d;
        const database = yield database_model_1.DatabaseModel.findById(task.base_de_datos._id);
        const MessageModelSelected = yield messageModel_model_1.messageModel.findById(task.modelo_mensaje._id);
        if (!database)
            return cb({ success: false, message: 'no existe esa base de datos' });
        if (!MessageModelSelected)
            return cb({ success: false, message: 'no existe ese modelo' });
        console.log((0, exports.getOrCreateUser)(wspUser));
        try {
            for (var _e = true, _f = __asyncValues(database.data.entries()), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
                _c = _g.value;
                _e = false;
                const [index, client] = _c;
                let taskProgress = (index / database.data.length) * 100;
                (0, exports.getOrCreateUser)(wspUser).io.to(data.socket.id).emit('task: progress', {
                    taskid: task._id,
                    progress: taskProgress,
                    state: 'Enviando'
                });
                const UserTaskIDX = exports.UserTask.findIndex((e) => e.userID === wspUser.userID);
                const taskIDX = exports.UserTask[UserTaskIDX].tasks.findIndex((t) => t._id === task._id);
                if (UserTaskIDX !== -1) {
                    exports.UserTask[UserTaskIDX].tasks[taskIDX].progress = taskProgress;
                    exports.UserTask[UserTaskIDX].tasks[taskIDX].state = 'Enviando';
                }
                let Message = MessageModelSelected.message.replace(/\$(\w+)/g, (_, variable) => {
                    if (variable === 'Saludo') {
                        return (0, watss_herlpers_1.getDayStatus)();
                    }
                    return client[variable];
                });
                try {
                    yield (0, baileys_1.delay)(1000);
                    const messageSend = yield ((_d = (0, exports.getOrCreateUser)(wspUser).wspInstance) === null || _d === void 0 ? void 0 : _d.sendMessage(`5491150562309@s.whatsapp.net`, {
                        text: Message
                    }));
                    console.log(messageSend);
                }
                catch (error) {
                    console.log(error);
                }
                if (index === database.data.length - 1) {
                    data.io.to(data.socket.id).emit('task: progress', {
                        taskid: task._id,
                        progress: 100,
                        state: 'Tarea terminada'
                    });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = _f.return)) yield _b.call(_f);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }));
};
exports.startWhatsappController = startWhatsappController;
const WspInstance = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { io, socket, wspConnState } = user;
    io.to(socket.id).emit('whatsapp-connection-status', user.wspConnState);
});
const createWspInstance = (userConnected) => __awaiter(void 0, void 0, void 0, function* () {
    const user = userConnected;
    const { state, saveCreds } = yield (0, watss_herlpers_1.fileAuthState)(user.userID);
    const newWsp = (0, baileys_1.default)({
        printQRInTerminal: false,
        auth: state,
        browser: ['Gestor de mensajeria', 'Gestor de mensajeria', 'Gestor de mensajeria'],
        syncFullHistory: true
    });
    const userWsp = Object.assign(Object.assign({}, user), { wspInstance: newWsp });
    wspEvents(userWsp, saveCreds);
});
const wspEvents = (user, saveCreds) => {
    var _a, _b, _c, _d;
    (_a = user.wspInstance) === null || _a === void 0 ? void 0 : _a.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => __awaiter(void 0, void 0, void 0, function* () {
        var _e, _f;
        console.log(chalk_1.default.blueBright(connection));
        if (qr !== null) {
            user.io.to(user.socket.id).emit('whatsapp-connection-qr', qr);
        }
        (0, exports.getOrCreateUser)(user)
            .io.to((0, exports.getOrCreateUser)(user).socket.id)
            .emit('whatsapp-connection-status', user.wspConnState);
        if (connection !== undefined) {
            (0, exports.updateUserWspState)(user.userID, connection, user.wspInstance);
            (0, exports.getOrCreateUser)(user)
                .io.to((0, exports.getOrCreateUser)(user).socket.id)
                .emit('whatsapp-connection-status', connection);
        }
        if (connection === 'close') {
            const shouldReconnect = ((_f = (_e = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _e === void 0 ? void 0 : _e.output) === null || _f === void 0 ? void 0 : _f.statusCode) !== baileys_1.DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, ', reconnecting ', shouldReconnect);
            // reconnect if not logged out
            if (shouldReconnect) {
                createWspInstance(user);
            }
        }
        else if (connection === 'open') {
            yield (0, baileys_1.delay)(1000);
            console.log(chalk_1.default.bgGreen('opened connection'));
            (0, exports.updateUserWspState)(user.userID, 'open', user.wspInstance);
            user.io.to(user.socket.id).emit('whatsapp-connection-status', 'open');
        }
    }));
    (_b = user.wspInstance) === null || _b === void 0 ? void 0 : _b.ev.on('creds.update', saveCreds);
    (_c = user.wspInstance) === null || _c === void 0 ? void 0 : _c.ev.on('messages.upsert', (m) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(chalk_1.default.blueBright(`Mensaje de ${m.messages[0].pushName}`));
        (0, exports.getOrCreateUser)(user).io.to((0, exports.getOrCreateUser)(user).socket.id).emit('wsp-history', m);
        // await user.wspInstance?.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' });
    }));
    (_d = user.wspInstance) === null || _d === void 0 ? void 0 : _d.ev.on('messaging-history.set', (messageHistory) => {
        (0, exports.getOrCreateUser)(user)
            .io.to((0, exports.getOrCreateUser)(user).socket.id)
            .emit('wsp-history', messageHistory);
    });
};
const addUser = (user) => {
    !exports.userWspController.some((wsp) => wsp.userID === user.userID) && exports.userWspController.push(user);
};
exports.addUser = addUser;
const getOrCreateUser = (userConnected) => {
    const userFinded = exports.userWspController.find((usr) => usr.userID === userConnected.userID);
    if (!userFinded) {
        exports.userWspController.push(userConnected);
        return userConnected;
    }
    return userFinded;
};
exports.getOrCreateUser = getOrCreateUser;
const updateUserWsp = (userID, Wsp) => {
    const user = exports.userWspController.findIndex((usr) => usr.userID === userID);
    exports.userWspController[user].wspInstance = Wsp;
};
exports.updateUserWsp = updateUserWsp;
const updateUserSocketID = (userID, socket) => {
    exports.userWspController = exports.userWspController.map((usr) => {
        if (usr.userID === userID) {
            return Object.assign(Object.assign({}, usr), { socket, socketID: socket.id });
        }
        return usr;
    });
};
exports.updateUserSocketID = updateUserSocketID;
const updateUserWspState = (userID, state, instance) => {
    exports.userWspController = exports.userWspController.map((usr) => {
        if (usr.userID === userID) {
            usr.wspConnState = state;
            usr.wspInstance = instance;
        }
        return usr;
    });
};
exports.updateUserWspState = updateUserWspState;
