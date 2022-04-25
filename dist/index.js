"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const child_process_1 = tslib_1.__importDefault(require("child_process"));
const inputPath = '/dev/input/by-path';
function playSound(path) {
    child_process_1.default.exec(`aplay "${path}"`, (error) => error && console.error(error));
}
async function listInputs() {
    return (await fs_1.default.promises.readdir(inputPath)).map((inputFile) => path_1.default.join(inputPath, inputFile));
}
async function findKeyboardPath() {
    return (await listInputs()).find((inputFile) => inputFile.endsWith('kbd'));
}
async function findMousePath() {
    return '/dev/input/mice';
}
function getMouseSoundFile(action) {
    return path_1.default.join(process.cwd(), `res/mouse/${action}.wav`);
}
function getKeyboardSoundFile(index, action) {
    return path_1.default.join(process.cwd(), `res/keyboard/variant${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 203, 200, 208, 205, 11, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 87, 88, 210, 211].includes(index)
        ? 1
        : index === 57
            ? 2
            : [28].includes(index)
                ? 3
                : 4}/key${action}.wav`);
}
async function mouseData(data) {
    const dataHex = data.toString('hex');
    if (['080000', '090000', '0a0000'].includes(dataHex)) {
        playSound(getMouseSoundFile(dataHex === '080000' ? 'up' : 'down'));
    }
}
async function keyboardData(data) {
    const action = data[44];
    const key = data[20];
    if ([1, 0].includes(action)) {
        playSound(getKeyboardSoundFile(key, !action ? 'down' : 'up'));
    }
}
async function run() {
    const keyboardPath = await findKeyboardPath();
    const mousePath = await findMousePath();
    mousePath && fs_1.default.createReadStream(mousePath).on('data', mouseData);
    keyboardPath && fs_1.default.createReadStream(keyboardPath).on('data', keyboardData);
}
run();
