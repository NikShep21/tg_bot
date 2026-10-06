export interface DialogType {
  id: string;
  name: string;
  type: "user" | "group" | "channel";
  username: string | null;
  unreadCount: number;
}

export interface MessageType {
  id: number;
  date: number;
  replyTo: number | null;
  text: string;
  author: "me" | "other";
}
export interface MessageAIType {
  date: string;
  text: string;
  author: string;
  replyTo: null | MessageAIType;
}
