import { NextRequest, NextResponse } from 'next/server';
import { getTelegramBot, escapeMarkdown } from '@/lib/telegram';
import { supabaseAdmin } from '@/lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bot = getTelegramBot();

    // Use Telegraf's handleUpdate for webhook requests
    // We wrap it in a promise to handle it in Next.js API route
    await bot.handleUpdate(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ error: 'Failed to process update' }, { status: 500 });
  }
}

// Initialize Bot logic (commands)
// In a production Next.js environment, we might want to move this 
// to a singleton or a dedicated initialization file if using a custom server.
// However, for Vercel/Standard Next.js, we define the logic here 
// so it's loaded when the route is hit.

const bot = getTelegramBot();

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

    // 3. Mark code as used (optional, we could also just delete it)
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
