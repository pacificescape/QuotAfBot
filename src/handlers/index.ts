import { Bot } from 'grammy';
import { MyContext } from 'types';

import messages from './messages';
import commands from './commands';
import inlineQueries from './inline-queries';


async function setup (bot: Bot<MyContext>) {
  await commands.setup(bot);
  await messages.setup(bot);
  await inlineQueries.setup(bot);
}

export default { setup };
