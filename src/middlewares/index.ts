import { Bot } from 'grammy';
import { hydrateContext } from '@grammyjs/hydrate';
import { logger, dbMiddleware, i18n } from 'infrastructure';
import { MyContext } from 'types';

import log from './log';
import userMiddleware from './user-middleware';
import answerCallbackQuery from './answer-cb-query';
// import setLocaleMiddleware from './set-locale';


async function setup (bot: Bot<MyContext>) {
  logger.info('Setting up middlewares...');

  bot.use(dbMiddleware);
  bot.use(log);
  bot.use(answerCallbackQuery);
  bot.use(hydrateContext());
  bot.use(userMiddleware);
  bot.use(i18n);

  // bot.use(setLocaleMiddleware);
}

export default { setup };
