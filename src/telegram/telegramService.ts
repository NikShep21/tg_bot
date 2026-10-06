import { TelegramClient } from "teleproto";
import { StoreSession } from "teleproto/sessions/StoreSession.js";
import { createInterface } from "node:readline/promises";
import type { DialogType, MessageType } from "../types/telegram.types.js";
import { Api } from "teleproto";

export class TelegramService {
  private readonly client: TelegramClient;
  private readonly connectionRetries = 5;

  constructor(apiId: number, apiHash: string, fileName = "telegram_session") {
    const session = new StoreSession(fileName);

    this.client = new TelegramClient(session, apiId, apiHash, {
      connectionRetries: this.connectionRetries,
    });
  }

  async start(): Promise<void> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      await this.client.start({
        phoneNumber: () => rl.question("Phone: "),
        password: () => rl.question("2FA password: "),
        phoneCode: () => rl.question("Code: "),
        onError: console.error,
      });
    } finally {
      rl.close();
    }
  }

  async getDialogs(): Promise<DialogType[]> {
    const dialogs = await this.client.getDialogs();
    const dialogsResult: DialogType[] = [];
    for (const dialog of dialogs) {
      if (!dialog.id || !dialog.name) continue;
      const entity = dialog.entity;

      const username =
        entity && "username" in entity ? (entity.username ?? null) : null;

      dialogsResult.push({
        id: dialog.id?.toString(),
        name: dialog.name,
        username: username,
        type: dialog.isUser ? "user" : dialog.isChannel ? "channel" : "group",
        unreadCount: dialog.unreadCount,
      });
    }
    return dialogsResult;
  }
  private adaptMessageData(message: Api.Message): MessageType {
    return {
      id: message.id,
      date: message.date,
      replyTo: message.replyToMsgId ?? null,
      text: message.message,
      author: message.out ? "me" : "other",
    };
  }
  async getMessages(
    username: string,
    limit: number = 100,
  ): Promise<MessageType[]> {
    const target = await this.client.getInputEntity(username);
    const messages = await this.client.getMessages(target, { limit });
    const messagesResult: MessageType[] = [];
    for (const message of messages) {
      messagesResult.push(this.adaptMessageData(message));
    }
    return messagesResult;
  }
  async getMessageById(username: string, id: number): Promise<MessageType> {
    const target = await this.client.getInputEntity(username);
    const messages = await this.client.getMessages(target, { ids: [id] });
    const message = messages[0];
    if (!message) throw new Error(`Message with id ${id} not found`);
    return this.adaptMessageData(message);
  }
  async sendMessage(
    username: string,
    message: string,
    replyTo?: number,
  ): Promise<void> {
    const target = await this.client.getInputEntity(username);
    await this.client.sendMessage(target, {
      message,
      ...(replyTo !== undefined ? { replyTo } : {}),
    });
  }
  async setTyping(username: string): Promise<() => Promise<void>> {
    const target = await this.client.getInputEntity(username);

    await this.client.setTyping(target, "typing");

    const interval = setInterval(() => {
      void this.client.setTyping(target, "typing");
    }, 4000);

    const closeTyping = async () => {
      clearInterval(interval);
      await this.client.setTyping(target, "cancel");
    };
    return closeTyping;
  }
  async updateStatus(status: "online" | "offline"): Promise<void> {
    await this.client.updateStatus(status === "online");
  }
  async messageListener(
    allowedChats: string[],
    callback: () => void,
  ): Promise<void> {
    this.client.updates.on("newMessage", callback, {
      chats: allowedChats,
    });
  }
}
