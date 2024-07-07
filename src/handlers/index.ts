import { Bot } from 'grammy';
import { MyContext } from 'types';

import messages from './messages';
import commands from './commands';
import inlineQueries from './inline-queries';
import preCheckoutQuery from './pre-checkout-query';


async function setup (bot: Bot<MyContext>) {
  await commands.setup(bot);
  await messages.setup(bot);
  await inlineQueries.setup(bot);
  await preCheckoutQuery.setup(bot);
}

export default { setup };
