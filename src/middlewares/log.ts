import { NextFunction } from 'grammy';
import { logger } from 'infrastructure';
import { MyContext } from 'types';


export default (ctx: MyContext, next: NextFunction) => {
  ctx.message?.text && logger.info(ctx.message.text);

  return next();
};
