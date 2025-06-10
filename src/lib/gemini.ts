import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

export async function generateCaptions(videoUrl: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Please generate accurate captions/subtitles for this YouTube video: ${videoUrl}. 
    Format the output as a .srt file with proper timing and sequence numbers. 
    Include speaker identification if there are multiple speakers.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating captions:', error);
    throw new Error('Failed to generate captions');
  }
} 