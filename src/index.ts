import { TelegramService } from "./telegram/telegramService.js";
import "dotenv/config";

const tgId = Number(process.env.TELEGRAM_ID);
const tgHash = process.env.TELEGRAM_HASH;

if (!tgHash || !tgId) throw new Error("Задайте базовый env");

const telegramService = new TelegramService(tgId, tgHash);

await telegramService.start();
await telegramService.sendMessage("@Zenderio", "ответ на сообщение", 141270);
