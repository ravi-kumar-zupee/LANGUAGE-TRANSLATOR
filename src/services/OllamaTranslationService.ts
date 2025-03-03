import axios from 'axios';
import { ITranslationService } from './ITranslationService';

export class OllamaTranslationService implements ITranslationService {
    private model: string;

    constructor(model: string) {
        this.model = model;
    }

    async translateText(sourceLang: string, targetLang: string, text: string): Promise<string> {
        const BRAND_WORDS: string[] = ["Zupee", "Ludo"];
        const brandWordsFormatted: string = BRAND_WORDS.join(", ");
        const prompt: string = `You are a professional translator. Your task is to accurately translate text from ${sourceLang} to ${targetLang} while strictly following these instructions:

        ### CRITICAL INSTRUCTIONS:
        1. **Preserve Brand Words**: The following words **MUST** remain in English and **must not be transliterated**: ${brandWordsFormatted}  
           - **Example:**  
             **Input:** "Play Zupee Ludo now"  
             **Correct Output:** "अभी Zupee Ludo खेलें"  
        
        2. **Translation Rules**:  
           - Translate **ONLY** the non-brand words to ${targetLang}.  
           - Maintain proper grammar, fluency, and a natural tone in ${targetLang}.  
           - Do **NOT** provide explanations, transliterations, or extra details.  
           - Do **NOT** modify, reformat, or alter the provided brand words in **any** way.  
        
        ### Text to Translate:
        "${text}"
        
        ### Expected Output:
        Return **only** the translated text in ${targetLang} script, keeping brand words in English. Do not include any additional text or formatting.`;

        try {
            console.log("Sending request to Ollama API...");
            const response = await axios.post('http://localhost:11434/api/generate', {
                model: this.model,
                prompt: prompt,
                stream: false
            });
            
            console.log("Raw API response:", JSON.stringify(response.data, null, 2));
            
            // Check if response.data exists and has the expected structure
            if (!response.data) {
                throw new Error("Empty response from API");
            }
            
            // Different Ollama models might return different response structures
            // Let's handle both common formats
            let translatedText: string = '';
            
            if (typeof response.data.response === 'string') {
                translatedText = response.data.response;
            } else if (typeof response.data.generation === 'string') {
                translatedText = response.data.generation;
            } else if (typeof response.data === 'string') {
                translatedText = response.data;
            } else {
                console.log("Unexpected response format:", response.data);
                throw new Error("Could not find translation in API response");
            }
            
            if (!translatedText) {
                throw new Error("Translation is empty");
            }
            return translatedText;
        } catch (error) {
            console.error("Error translating text:", error);
            
            if (axios.isAxiosError(error)) {
                console.error("API Error Details:", error.response?.data || error.message);
                console.error("Status:", error.response?.status);
            }
            return text;
        }
    }
} 