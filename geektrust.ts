import { FamilyManager } from "./models/family-manager";
import fs from 'fs';
import { EOL } from 'os';

const args = process.argv;
if (args.length < 3) {
    console.log('Syntax: npm start --silent <absolute_path_to_input_file>');
    process.exit(0);
}

const inputFile = args[2];
const fileContents = fs.readFileSync(inputFile, "utf-8");
if (!fileContents || fileContents.length === 0) {
    console.log('Input file not found or empty.');
    process.exit(0);   
}

const commands: string[] = fileContents.split(EOL);

const familyManager = new FamilyManager();
for (let command of commands) {
    processCommand(command);
}

function processCommand(command: string) {
    const commandTokens = splitCommandTokens(command);
    if (commandTokens.length > 0) {
        switch(commandTokens[0]) {
            case "ADD_CHILD":
                const addResult = familyManager.addChild(commandTokens[1], commandTokens[2], commandTokens[3]);
                console.log(addResult);
                break;
            case "GET_RELATIONSHIP":
                const relationResult: any = familyManager.getRelationship(commandTokens[1], commandTokens[2]);
                console.log(relationResult);
                break;
            default:
                console.log('Invalid command');
        }
    }
}
function splitCommandTokens(command: string)  {
    return command.split(' ').filter(x => x.trim().length !== 0);
}
