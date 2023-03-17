import { isPrivate } from 'filters';
import { Bot, InlineKeyboard } from 'grammy';
import { MyContext } from 'types';


const setup = async (bot: Bot<MyContext>) => {
  bot
    .filter(isPrivate)
    .command('delete', (ctx) => {
      ctx.reply(ctx.t('settings-delete-message'), {
        reply_markup: new InlineKeyboard([[
          {
            text: ctx.t('start-menu-inline'),
            switch_inline_query_current_chat: 'delete::inline'
          },
          {
            text: ctx.t('start-menu-private'),
            switch_inline_query_current_chat: 'delete::private'
          }
        ]])
      })
    });
};

export default { setup };
