import Anthropic from 'anthropic-ai';

const anthropic = new Anthropic(process.env.ANTHROPIC_API_KEY || '');

export class ClaudeClient {
  static async prompt(message: string, options?: any) {
    try {
      const response = await anthropic.complete(message, {
        maxTokensToSample: 2000,
        temperature: 0.3,
        ...options,
      });
      return response || '';
    } catch (error: any) {
      console.error('Claude API error:', error);
      throw new Error(error.message || 'Claude API error');
    }
  }
}
