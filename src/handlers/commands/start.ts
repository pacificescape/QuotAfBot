import { Composer, InlineKeyboard, InputFile, Keyboard } from 'grammy';
import { isPrivate } from 'filters';
import { MyContext } from 'types';
import { generateSticker } from 'services/api';
import { DefaultStickers } from 'infrastructure';


const text = 'Nice to\nmeet you\n❤️';

export async function startPrivateMessage (ctx: MyContext) {
  await ctx.reply(ctx.t('start-text'), {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: new InlineKeyboard([
      [
        {
          text: ctx.t('start-random-button-text'),
          switch_inline_query_current_chat: ctx.t('start-inline-query'),
        },
      ],
    ]),
  });

  if (!ctx.session.user.started) {
    const sticker = await generateSticker(text, DefaultStickers.inline.menherachanPlate);

    await ctx.api.sendSticker(
      ctx.chat.id,
      new InputFile(sticker, 'hello.tgs'),
    );

    ctx.session.stats.stickers_uploaded += 1;
  }

  ctx.session.user.started = true;
}

async function setup (composer: Composer<MyContext>) {
  composer.filter(isPrivate).command('start', startPrivateMessage);
}

export default { setup };
