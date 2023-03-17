import { NextFunction } from 'grammy';
import { MyContext } from 'types';

import { Database } from './index';


const middleware = (db: typeof Database) => async (ctx: MyContext, next: NextFunction) => {
  ctx.db = db;

  return await next();
};

export default middleware;
