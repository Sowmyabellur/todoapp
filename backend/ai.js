import {google} from '@ai-sdk/google';
import { streamText } from 'ai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages = [
    {
        role:'system',
        content:
            'You are Tutor of js and Nodejs,you have to answer only this subjects or concepts,out the context you cannot answer and give answer in short and text format only',
    },
];

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({ role: 'user', content: userInput });

    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages,
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: '); 
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');

    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);