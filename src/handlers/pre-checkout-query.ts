import { Composer } from 'grammy';
import { logger } from 'infrastructure';
import { MyContext } from 'types';

const handlePreCheckoutQuery = async (ctx: MyContext) => {
  try {
    if (!ctx.preCheckoutQuery) {
      logger.error('Pre-checkout query is missing');
      return;
    }

    await ctx.answerPreCheckoutQuery(true);

  } catch (error) {
    logger.error('Error handling pre-checkout query:', error);

    try {
      await ctx.answerPreCheckoutQuery(false, { error_message: "An unexpected error occurred. Please try again later." });
    } catch (answerError) {
      logger.error('Error answering pre-checkout query:', answerError);
    }
  }
};

async function setup (composer: Composer<MyContext>) {
  composer.on('pre_checkout_query', handlePreCheckoutQuery);
}

export default {
  setup
};