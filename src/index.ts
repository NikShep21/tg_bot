import { formatChatHistory } from "./chat/formatChatHistory.js";
import { TelegramService } from "./telegram/telegramService.js";
import "dotenv/config";

const tgId = Number(process.env.TELEGRAM_ID);
const tgHash = process.env.TELEGRAM_HASH;

if (!tgHash || !tgId) throw new Error("Задайте базовый env");

const telegramService = new TelegramService(tgId, tgHash);

await telegramService.start();

telegramService.messageListener(["me"], async () => {
  telegramService.sendMessage("@Zenderio", "Иди нахуй");
});
