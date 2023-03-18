import { Bot } from 'grammy';
import { hydrateContext } from '@grammyjs/hydrate';
import { logger, dbMiddleware, i18n } from 'infrastructure';
import { MyContext } from 'types';

import log from './log';
import userMiddleware from './user-middleware';
import answerCallbackQuery from './answer-cb-query';
import stats from './stats-middleware';


async function setup (bot: Bot<MyContext>) {
  logger.info('Setting up middlewares...');

  bot.use(dbMiddleware);
  bot.use(log);
  await stats.setup(bot);
  bot.use(answerCallbackQuery);
  bot.use(hydrateContext());
  bot.use(userMiddleware);
  bot.use(i18n);
}

export default { setup };
