import { NextFunction } from 'grammy';
import { logger } from 'infrastructure';
import { MyContext } from 'types';


const userMiddleware = async (ctx: MyContext, next: NextFunction) => {
  if (!ctx.from) {return next();}

  let user = await ctx.db.User.findOne({ telegram_id: ctx.from.id });

  if (!user) {
    user = new ctx.db.User();
    user.telegram_id = ctx.from.id;
    user.locale = ctx.from.language_code ?? 'en';
  }

  user.first_name = ctx.from.first_name;
  user.last_name = ctx.from.last_name;
  user.username = ctx.from.username;
  ctx.session.user = user;

  return next().then(async () => {
    await ctx.session.user.save()
      .catch(logger.error);
  });
};

export default userMiddleware;
