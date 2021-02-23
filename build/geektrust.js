"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var person_1 = require("./models/person");
var fs_1 = __importDefault(require("fs"));
var os_1 = require("os");
var args = process.argv;
if (args.length < 3) {
    console.log('Syntax: npm start --silent <absolute_path_to_input_file>');
    process.exit(0);
}
var inputFile = args[2];
var fileContents = fs_1.default.readFileSync(inputFile, "utf-8");
if (!fileContents || fileContents.length === 0) {
    console.log('Input file not found or empty.');
    process.exit(0);
}
var commands = fileContents.split(os_1.EOL);
var familyManager = new person_1.FamilyManager();
for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
    var command = commands_1[_i];
    processCommand(command);
}
function processCommand(command) {
    var commandTokens = splitCommandTokens(command);
    if (commandTokens.length > 0) {
        switch (commandTokens[0]) {
            case "ADD_CHILD":
                var addResult = familyManager.addChild(commandTokens[1], commandTokens[2], commandTokens[3]);
                console.log(addResult);
                break;
            case "GET_RELATIONSHIP":
                var relationResult = familyManager.getRelationship(commandTokens[1], commandTokens[2]);
                console.log(relationResult);
                break;
            default:
                console.log('Invalid command');
        }
    }
}
function splitCommandTokens(command) {
    return command.split(' ').filter(function (x) { return x.trim().length !== 0; });
}
