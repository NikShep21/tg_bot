import { TelegramClient } from "teleproto";
import { StoreSession } from "teleproto/sessions/StoreSession.js";
import { createInterface } from "node:readline/promises";

interface DialogType {
  id: string;
  name: string;
  type: "user" | "group" | "channel";
  username: string | null;
  unreadCount: number;
}

interface MessageType {}

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

  async getDialogs() {
    const dialogs = await this.client.getDialogs();
    const dialogsResult = [];
    for (const dialog of dialogs) {
      if (!dialog.id || !dialog.name) continue;
      const entity = dialog.entity;

      const username =
        entity && "username" in entity ? (entity.username ?? null) : null;

      const data: DialogType = {
        id: dialog.id?.toString(),
        name: dialog.name,
        username: username,
        type: dialog.isUser ? "user" : dialog.isChannel ? "channel" : "group",
        unreadCount: dialog.unreadCount,
      };

      dialogsResult.push(data);
    }
    return dialogsResult;
  }

  async getMessages(findItem: string, limit: number = 100) {
    const target = await this.client.getInputEntity(findItem);

    return this.client.getMessages(target, { limit });
  }
}
