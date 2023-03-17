import { Bot } from 'grammy';
import { parseMode } from '@grammyjs/parse-mode';
import { hydrateApi } from '@grammyjs/hydrate';
import { logger } from 'infrastructure';

import throttler from './throttler';


async function setup (bot: Bot) {
  logger.info('Setting up API transformers...');

  bot.api.config.use(throttler);
  bot.api.config.use(hydrateApi());
  bot.api.config.use(parseMode('HTML'));
}

export default { setup };
