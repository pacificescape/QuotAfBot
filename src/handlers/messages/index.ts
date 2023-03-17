import { isPrivate } from 'filters';
import { Composer } from 'grammy';
import { MyContext } from 'types';
import { NewComponentView } from 'views/animated';

import handlePrivateText from './private';
import handleAnimatedSticker from './animated-sticker';


const setup = async (composer: Composer<MyContext>) => {
  composer
    .filter(isPrivate)
    .on(':text', handlePrivateText);
  composer
    .filter(isPrivate)
    .on(':sticker:is_animated', (ctx) => NewComponentView.enter(ctx));
  composer.on('message', (ctx) => {
    ctx.reply('unknown type of message');
  });
};

export default {
  setup,
  handlePrivateText,
  handleAnimatedSticker,
};
