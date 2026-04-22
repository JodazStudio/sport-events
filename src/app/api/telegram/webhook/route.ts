import { NextRequest, NextResponse } from 'next/server';
import { getTelegramBot } from '@/lib/telegram';
import { supabaseAdmin } from '@/lib';
import { Telegraf } from 'telegraf';

export const dynamic = 'force-dynamic';

// Singleton instance to ensure we only register handlers once
let botInstance: Telegraf | null = null;
let isHandlersRegistered = false;

function setupBot(): Telegraf | null {
  if (botInstance && isHandlersRegistered) return botInstance;

  const bot = getTelegramBot();
  if (!bot) return null;

  // --- COMMANDS ---

  bot.start((ctx) => {
    const welcomeMessage = [
      `*👋 ¡Hola\\! Bienvenido al Bot de Zonacrono\\.*`,
      '',
      `Para recibir alertas de tus eventos, necesito vincular tu cuenta\\.`,
      '',
      `Por favor, ve a tu *Dashboard de Zonacrono*, busca la sección de Telegram y usa el comando:`,
      '',
      `\`/verificar CODIGO\``,
    ].join('\n');

    return ctx.replyWithMarkdownV2(welcomeMessage);
  });

  bot.command('verificar', async (ctx) => {
    const text = ctx.message.text;
    const parts = text.split(' ');
    
    if (parts.length < 2) {
      return ctx.replyWithMarkdownV2('❌ Por favor, proporciona el código de verificación\\.\nUso: `/verificar 123456`');
    }

    const code = parts[1];
    const chatId = ctx.chat.id;

    if (!supabaseAdmin) {
      return ctx.replyWithMarkdownV2('❌ Error de configuración del servidor\\. Por favor intenta más tarde\\.');
    }

    try {
      // 1. Check if the code is valid and not expired
      const { data: verification, error: verifyError } = await supabaseAdmin
        .from('telegram_verification_codes')
        .select('manager_id, expires_at')
        .eq('code', code)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (verifyError || !verification) {
        return ctx.replyWithMarkdownV2('❌ Código inválido o expirado\\. Por favor genera uno nuevo desde el Dashboard\\.');
      }

      // 2. Update the manager with the telegram_chat_id
      const { error: updateError } = await supabaseAdmin
        .from('managers')
        .update({ 
          telegram_chat_id: chatId,
          telegram_notifications_enabled: true 
        })
        .eq('id', verification.manager_id);

      if (updateError) {
        console.error('Error updating manager telegram_chat_id:', updateError);
        return ctx.replyWithMarkdownV2('❌ Error al vincular la cuenta\\. Por favor contacta a soporte\\.');
      }

      // 3. Mark code as used
      await supabaseAdmin
        .from('telegram_verification_codes')
        .delete()
        .eq('code', code);

      const successMessage = [
        `*✅ ¡Cuenta vinculada con éxito\\!*`,
        '',
        `Ahora recibirás notificaciones instantáneas de tus eventos directamente aquí\\.`,
      ].join('\n');

      return ctx.replyWithMarkdownV2(successMessage);
    } catch (err) {
      console.error('Unexpected error during verification:', err);
      return ctx.replyWithMarkdownV2('❌ Ocurrió un error inesperado\\. Por favor intenta más tarde\\.');
    }
  });

  bot.help((ctx) => {
    const helpText = [
      `*📌 Comandos disponibles:*`,
      '',
      `/start \\- Iniciar interacción`,
      `/verificar \\- Vincular tu cuenta de Zonacrono`,
      `/help \\- Mostrar este mensaje`,
    ].join('\n');
    return ctx.replyWithMarkdownV2(helpText);
  });

  botInstance = bot;
  isHandlersRegistered = true;
  return bot;
}

export async function POST(request: NextRequest) {
  try {
    const bot = setupBot();
    
    if (!bot) {
      console.error('Telegram Bot is not configured (missing token)');
      return NextResponse.json({ error: 'Bot not configured' }, { status: 503 });
    }

    const body = await request.json();

    // Use Telegraf's handleUpdate for webhook requests
    await bot.handleUpdate(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ error: 'Failed to process update' }, { status: 500 });
  }
}
