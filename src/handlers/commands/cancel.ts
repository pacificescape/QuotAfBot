import { isPrivate } from 'filters';
import { Bot } from 'grammy';
import { MyContext } from 'types';


const setup = async (bot: Bot<MyContext>) => {
  bot
    .filter(isPrivate)
    .command('cancel', (ctx) => {
      ctx.view.leave();
    });
};

export default { setup };
