import { isPrivate } from 'filters';
import { Composer } from 'grammy';
import { MyContext } from 'types';
import { NewComponentView } from 'views/animated';

import handlePrivateText from './private';
import handleAnimatedSticker from './animated-sticker';


const setup = async (composer: Composer<MyContext>) => {
  composer
    .on(':successful_payment', (ctx) => {
      ctx.session.user.stars = (ctx.session.user.stars ?? 0) + ctx.message.successful_payment.total_amount;
      ctx.reply(ctx.t('stars-donate-success')).catch(console.error);
    });
  composer
    .filter(isPrivate)
    .on(':text', handlePrivateText);
  composer
    .filter(isPrivate)
    .on(':sticker:is_animated', (ctx) => NewComponentView.enter(ctx));
  composer.on('message', (ctx) => {
    ctx.reply('unknown type of message').catch(console.error);
  });
};

export default {
  setup,
  handlePrivateText,
  handleAnimatedSticker,
};
