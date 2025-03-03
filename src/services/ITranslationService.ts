export interface ITranslationService {
    translateText(sourceLang: string, targetLang: string, text: string): Promise<string>;
} 