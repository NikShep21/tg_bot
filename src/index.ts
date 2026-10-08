import { AiService } from "./ai/aiService.js";

import "dotenv/config";
import { config } from "./config/config.js";
import { TelegramService } from "./telegram/telegramService.js";
import { ChatManager } from "./chat/chatManager.js";
import path from "node:path";

const openRouterKey = process.env.OPENROUTER_API_KEY;
const tgHash = process.env.TELEGRAM_HASH;
const tgId = Number(process.env.TELEGRAM_ID);

if (!openRouterKey || !tgHash || !tgId)
  throw new Error("please, create all env fields");

const systemPromptPath = path.resolve("prompts/systemPrompt.txt");
const telegram = new TelegramService(tgId, tgHash);
const ai = new AiService(openRouterKey, config.ai.model);

telegram.start();
// const manager = new ChatManager(telegram, ai, systemPromptPath);
// manager.listenChats(config.telegram.allowedChats);
