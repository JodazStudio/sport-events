import { Telegraf } from 'telegraf';

// Singleton instance of the bot
let botInstance: Telegraf | null = null;

export const getTelegramBot = (): Telegraf | null => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN is not defined in environment variables');
    return null;
  }

  if (!botInstance) {
    botInstance = new Telegraf(token);
  }
  return botInstance;
};

/**
 * Escapes characters for Telegram MarkdownV2
 * @see https://core.telegram.org/bots/api#markdownv2-style
 */
export const escapeMarkdown = (text: string): string => {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
};

/**
 * Sends a notification to a specific chat using MarkdownV2
 */
export const sendTelegramNotification = async (chatId: string | number, message: string) => {
  try {
    const bot = getTelegramBot();
    if (!bot) {
      console.error('Cannot send notification: Telegram Bot is not configured (missing token)');
      return { success: false, error: 'Bot not configured' };
    }
    await bot.telegram.sendMessage(chatId, message, {
      parse_mode: 'MarkdownV2',
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return { success: false, error };
  }
};

/**
 * Helper to format a registration alert
 */
export const formatRegistrationAlert = (data: {
  eventName: string;
  athleteName: string;
  categoryName: string;
  amount: string;
}) => {
  const title = `*🚀 Nueva Inscripción*`;
  const event = `*Evento:* ${escapeMarkdown(data.eventName)}`;
  const athlete = `*Atleta:* ${escapeMarkdown(data.athleteName)}`;
  const category = `*Categoría:* ${escapeMarkdown(data.categoryName)}`;
  const payment = `*Monto:* ${escapeMarkdown(data.amount)}`;

  return [title, '', event, athlete, category, payment].join('\n');
};
