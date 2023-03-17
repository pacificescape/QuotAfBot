import { Bot } from 'grammy';
import { logger } from 'infrastructure';
import { MyContext } from 'types';

import lang from './lang';
import start from './start';
import unknown from './unknown';
import cancel from './cancel';
import del from './delete';


async function setup (bot: Bot<MyContext>) {
  logger.info('Setting up command handlers...');

  await start.setup(bot);
  await lang.setup(bot);
  await cancel.setup(bot);
  await del.setup(bot);
  await unknown.setup(bot);
}

export default {
  setup,
  lang,
  start,
  unknown,
};
