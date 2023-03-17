import { BotError } from 'grammy';
import { logger } from 'infrastructure';
import { MyContext } from 'types';


const errorHandler = (error: BotError<MyContext>) => {
  logger.error(error.message);
};

export default {
  handler: errorHandler,
};
