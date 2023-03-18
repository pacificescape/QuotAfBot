import { createView } from '@loskir/grammy-views';
import { InlineKeyboard, InputFile } from 'grammy';
import handleAnimatedSticker from 'handlers/messages/animated-sticker';
import { HydratedComponent, logger } from 'infrastructure';
import { generateSticker } from 'services/api';
import { addToFavorite } from 'services/sticker';
import { MyContext } from 'types';
import { getRandomEmoji } from 'utils';


export const NewComponentView = createView<MyContext, { component?: HydratedComponent }>('AnimatedView');

NewComponentView.onRender(async (ctx, next) => {
  const animatedSticker = await handleAnimatedSticker(ctx, next);

  if (!animatedSticker) {
    return; // TODO
  }

  const { message, component } = animatedSticker;

  if (message?.sticker) {
    const inlineKeyboard = new InlineKeyboard([[
      {
        text: ctx.t('add_animated-menu-inline'),
        callback_data: `add_inline:${ctx.message?.sticker.file_unique_id}`,
      },
      {
        text: ctx.t('add_animated-menu-private'),
        callback_data: `add_private:${ctx.message?.sticker.file_unique_id}`,
      },
      {
        text: ctx.t('keyboard-cancel'),
        callback_data: 'cancel',
      },
    ]]);

    await ctx.reply(ctx.t('add_animated-success'), {
      reply_markup: inlineKeyboard,
      reply_to_message_id: message?.message_id || 0,
    });

    ctx.view.state.component = component;
  } else {
    throw new Error('FAILED_TO_CREATE_STICKER');
  }
});

NewComponentView.on('message:text', async (ctx, next) => {
  const component = ctx.view?.state?.component;

  if (!component) {
    await ctx.view.leave();
    return next();
  }

  const sticker = await generateSticker(ctx.message.text, [component.file_unique_id, 'sharkDefaultAnimation', 'defaultAnimation']);

  if (!sticker) {
    throw new Error('Error due sticker generation');
  }

  const weight = Number((sticker.length / 1024).toFixed(2));

  logger.debug('weight:', weight, 'KB');

  if (weight >= 64) {
    throw new Error('Sticker file is too large');
  }

  await ctx.api.sendSticker(
    ctx.from.id,
    new InputFile(sticker, 'animated.tgs'),
    {
      emoji: getRandomEmoji(),
    },
  );

  ctx.session.stats.stickers_uploaded += 1;
});

NewComponentView.global.callbackQuery('*', (ctx) => {
  console.log(ctx)
})

NewComponentView.global.callbackQuery(/add_(inline|private):(.+)/, async (ctx) => {
  const mode = ctx.match[1] as 'inline' | 'private';
  const id = ctx.match[2];

  return addToFavorite(ctx.session.user, mode, id);
});