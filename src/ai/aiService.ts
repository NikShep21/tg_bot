import OpenAI from "openai";

export class AiService {
  private readonly client: OpenAI;
  private readonly model: string;
  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
    });
    this.model = model;
  }
  async generateResponse(
    systemPrompt: string,
    message: string,
  ): Promise<string> {
    const messages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      {
        role: "user" as const,
        content: message,
      },
    ];
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
    });
    if (!response.choices[0]?.message.content)
      throw new Error("no message from ai");
    return response.choices[0]?.message.content;
  }
}
