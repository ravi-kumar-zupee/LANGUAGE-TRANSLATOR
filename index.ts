// Step 1: Initialize a new Node.js project
// Run the following commands in your terminal:
// mkdir ollama-translation && cd ollama-translation
// npm init -y

// Step 2: Install necessary dependencies
// npm install axios dotenv

// Step 3: Install and run Ollama (if not installed)
// Run: curl -fsSL https://ollama.ai/install.sh | sh
// Then start Ollama if not running: ollama serve

import * as dotenv from 'dotenv';
import { ITranslationService } from './src/services/ITranslationService';
import { OllamaTranslationService } from './src/services/OllamaTranslationService';
import { OpenAITranslationService } from './src/services/OpenAITranslationService';

dotenv.config();

function getTranslationService(): ITranslationService {
    const serviceType: string = process.env.TRANSLATION_SERVICE || 'ollama';
    const model: string = process.env.OLLAMA_MODEL || 'llama3.1';
    const apiKey: string = process.env.OPENAI_API_KEY || '';

    switch (serviceType.toLowerCase()) {
        case 'ollama':
            return new OllamaTranslationService(model);
        case 'openai':
            return new OpenAITranslationService(apiKey);
        default:
            throw new Error(`Unsupported translation service: ${serviceType}`);
    }
}

async function main() {
    const translationService: ITranslationService = getTranslationService();
    try {
        const translatedText = await translationService.translateText("English (en)", "Marathi (mr)", "Play Zupee Ludo and win lakhs of cash prizes!");
        console.log("Translated Text:", translatedText);
    } catch (error) {
        console.error("Error translating text:", error);
    }
}

main();
