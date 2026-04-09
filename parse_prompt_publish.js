const fs = require('fs');
let code = fs.readFileSync('Prompt-Library-main-2/src/backend/controllers/PromptController.ts', 'utf8');

const startIndex = code.indexOf('static async publishPrompt(data: any, client?: any) {');
const endIndex = code.indexOf('static async getPromptById(id: string, client?: any) {');

console.log(code.substring(startIndex, endIndex));
