import type { MessageAIType, MessageType } from "../types/telegram.types.js";

const formatMessage = (
  message: MessageType,
  messagesById: Map<number, MessageType>,
): MessageAIType => {
  const date = new Date(message.date * 1000).toLocaleString("ru-RU", {
    timeZone: "Asia/Irkutsk",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  let replyTo: MessageAIType | null = null;

  if (message.replyTo) {
    const messageById = messagesById.get(message.replyTo);
    if (messageById) replyTo = formatMessage(messageById, messagesById);
  }
  return {
    date: date,
    text: message.text,
    author: message.author,
    replyTo: replyTo,
  };
};
export const formatChatHistory = (messages: MessageType[]): MessageAIType[] => {
  const messagesById = new Map<number, MessageType>();
  for (const message of messages) {
    messagesById.set(message.id, message);
  }
  const result: MessageAIType[] = [];
  for (const message of messages) {
    const formattedMessage = formatMessage(message, messagesById);
    result.push(formattedMessage);
  }

  return result;
};
