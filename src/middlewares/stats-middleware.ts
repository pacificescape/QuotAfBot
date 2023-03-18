import { isPrivate } from 'filters';
import { Bot, NextFunction } from 'grammy';
import { INLINE_OFFSET_LENGTH, logger } from 'infrastructure';
import { MyContext } from 'types';

const statsMiddleware = async (ctx: MyContext, next: NextFunction) => {
  const ms = Number(new Date());

  return next().then(async () => {
    logger.info('Response time:', `${Date.now() - ms}ms`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await ctx.db.User.countDocuments();

    await ctx.db.Stats.findOneAndUpdate(
      {
        createdAt: {
          $gte: today, // Match documents created on or after the current date
          $lt: new Date(Number(today) + 86_400_000), // Match documents created before the next day
        },
      },
      {
        $inc: {
          stickers_uploaded: ctx.session.stats.stickers_uploaded || 0,
          inline_queries: ctx.session.stats.inline_queries || 0,
          callback_queries: ctx.session.stats.callback_queries || 0,
          private_messages: ctx.session.stats.private_messages || 0,
        },
        $max: {
          users_count: users,
        },
        $addToSet: {
          ...(ctx.session.user?.telegram_id && {
            DAU: ctx.session.user._id,
          }),
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  });
};

const setup = async (bot: Bot) => {
  bot.use((ctx: MyContext, next: NextFunction) => {
    ctx.session.stats = {
      stickers_uploaded: 0,
      inline_queries: 0,
      callback_queries: 0,
      private_messages: 0,
    };

    return next();
  })
  bot.filter(isPrivate)
    .on('message', (ctx: MyContext, next: NextFunction) => {
      ctx.session.stats.private_messages = 1;

      return next();
    });
  bot.on('callback_query', (ctx: MyContext, next: NextFunction) => {
      ctx.session.stats.callback_queries = 1;

      return next();
    });
  bot.on('inline_query', (ctx: MyContext, next: NextFunction) => {
      ctx.session.stats.inline_queries = 1;
      ctx.session.stats.stickers_uploaded = INLINE_OFFSET_LENGTH; // TODO

      return next();
    });
  bot.use(statsMiddleware);
};

export default { setup };
