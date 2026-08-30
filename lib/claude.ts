import { Anthropic } from 'anthropic-ai';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class ClaudeClient {
  static async prompt(message: string, options?: any) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-5',
        max_tokens: 2000,
        temperature: 0.3,
        ...options,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      });
      return response.content[0]?.text || '';
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }
}
