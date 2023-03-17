import { Composer, InlineKeyboard } from 'grammy';
import { MyContext } from 'types';
import { isPrivate } from 'filters';


async function setup (composer: Composer<MyContext>) {
  composer
    .filter(isPrivate)
    .on(':entities:bot_command', async (ctx) => {
      ctx.reply(
        ctx.t('commands-unknown'),
        {
          reply_markup: new InlineKeyboard().switchInlineCurrent(
            ctx.t('commands-unknown-button'),
            ctx.message.text, // TODO: gzip r reply and gt text
          ),
        },
      );
    });
}

export default { setup };
