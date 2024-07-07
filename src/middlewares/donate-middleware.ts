import { InlineKeyboard, NextFunction } from 'grammy';
import { MyContext } from 'types';

const donateMessage = async (ctx: MyContext) => {
  await ctx.reply(ctx.t('stars-donate-prompt'), {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: new InlineKeyboard([
      [
        {
          text: ctx.t('stars-donate'),
          callback_data: 'donate'
        },
      ]
    ]),
  });
};

const donateMiddleware = async (ctx: MyContext, next: NextFunction) => {
  if (!ctx.from) {return next();}

  const user = ctx.session.user;

  if (!user) {
    return next();
  }

  return next().then(async () => {
    const thirtyDaysInMs = 20 * 24 * 60 * 60 * 1000;
    const lastPromptTime = ctx.session.user.lastDonationPromptedAt ? ctx.session.user.lastDonationPromptedAt.getTime() : 0;
    const toPrompt = Date.now() - lastPromptTime > thirtyDaysInMs;

    if (ctx.session.user.stars === 0 && toPrompt) {
      donateMessage(ctx);
      ctx.session.user.lastDonationPromptedAt = new Date();

      await ctx.session.user.save();
    }
  });
};

export default donateMiddleware;
