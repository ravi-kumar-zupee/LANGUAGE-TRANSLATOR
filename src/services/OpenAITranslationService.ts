import axios from 'axios';
import { ITranslationService } from './ITranslationService';

export class OpenAITranslationService implements ITranslationService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
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
            console.log("Sending request to OpenAI API...");
            const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
                prompt: prompt,
                max_tokens: 1000,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Raw API response:", JSON.stringify(response.data, null, 2));

            if (!response.data || !response.data.choices || response.data.choices.length === 0) {
                throw new Error("Empty response from API");
            }

            const translatedText: string = response.data.choices[0].text.trim();
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