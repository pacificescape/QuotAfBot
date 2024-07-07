import 'dotenv/config';
import 'utils/check-dotenv';
import * as typesNode from 'grammy/out/types.node';
import { GrammyError, HttpError, session } from 'grammy';
import { FileAdapter } from '@grammyjs/storage-file';
import views from 'views';
import middlewares from 'middlewares';
import transformers from 'transformers';
import { allowedUpdates } from 'utils';
import { Database, logger, DEFAULT_SESSION } from 'infrastructure';
import error from 'handlers/error';
import commands from 'handlers/commands';
import messages from 'handlers/messages';
import inlineQueries from 'handlers/inline-queries';
import preCheckoutQuery from 'handlers/pre-checkout-query';

import bot from './bot';


async function onStartup (botInfo: typesNode.UserFromGetMe): Promise<void> {
  bot.use(session({
    initial: () => DEFAULT_SESSION,
    getSessionKey: (ctx) => String(ctx.from.id),
    storage: new FileAdapter({ dirName: 'sessions' }),
  }));

  await transformers.setup(bot);
  await middlewares.setup(bot);
  await views.setup(bot);
  await preCheckoutQuery.setup(bot);
  await commands.setup(bot);
  await inlineQueries.setup(bot);
  await messages.setup(bot);


  bot.errorHandler = error.handler;
  bot.catch((error_) => {
    const ctx = error_.ctx;

    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = error_.error;

    if (e instanceof GrammyError) {
      console.error('Error in request:', e.description);
    } else if (e instanceof HttpError) {
      console.error('Could not contact Telegram:', e);
    } else {
      console.error('Unknown error:', e);
    }
  });

  logger.info(JSON.stringify(botInfo, null, 2));
}

Database.connection.once('open', async () => {
  logger.info('Connected to MongoDB');

  bot.start({
    drop_pending_updates: false,
    allowed_updates: allowedUpdates,
    onStart: onStartup,
  });
});
