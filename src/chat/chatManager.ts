import { readFile } from "node:fs/promises";
import type { AiService } from "../ai/aiService.js";
import type { TelegramService } from "../telegram/telegramService.js";

export class ChatManager {
  private systemPrompt = "";
  constructor(
    private readonly telegram: TelegramService,
    private readonly ai: AiService,
    private readonly systemPromptPath: string,
  ) {}
  private async readSystemPrompt(): Promise<string> {
    return readFile(this.systemPromptPath, "utf-8");
  }
  async listenChats(allowedChats: string[]) {
    await this.telegram.start();
    this.telegram.messageListener(allowedChats, (update) => {
      console.log(update);
    });
  }
}
