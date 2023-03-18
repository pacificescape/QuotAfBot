import { logger, lruCache } from 'infrastructure';
import { MyContext } from 'types';
import { createComponent } from 'services/component';
import { InlineKeyboard, NextFunction } from 'grammy';


const handleAnimatedSticker = async (ctx: MyContext, next: NextFunction) => {
  try {
    if (!ctx.message?.sticker?.is_animated) {
      await ctx.reply(ctx.t('error-is-animated-required'));
      return;
    }

    const cache = lruCache.get(ctx.message.sticker.file_unique_id);

    if (cache) {
      logger.debug(JSON.stringify(cache, null, 2));

      if (cache.type === 'random') {
        const inlineKeyboard = new InlineKeyboard([[
          {
            text: ctx.t('add_animated-menu-inline'),
            callback_data: `add_inline:${cache.componentUniqueId}`,
          },
          {
            text: ctx.t('add_animated-menu-private'),
            callback_data: `add_private:${cache.componentUniqueId}`,
          },
          {
            text: ctx.t('keyboard-cancel'),
            callback_data: 'cancel',
          },
        ]]);
    
        await ctx.reply(ctx.t('add_animated-success'), {
          reply_markup: inlineKeyboard,
          reply_to_message_id: ctx.message?.message_id || 0,
        });
      }

      if (cache.type === 'delete') {
        const newFromStickers = {
          ...ctx.session.user.settings[cache.from].stickers,
        };

        delete newFromStickers[cache.componentUniqueId]

        ctx.session.user.settings[cache.from] = { stickers: newFromStickers }

        return next().then(() => {
          ctx.reply(`sticker deleted from ${cache.from}`)
        })
      }

      return;
    }

    if (ctx.message.via_bot?.username === ctx.me.username) {
      return;
    }

    return await createComponent(ctx);
  } catch (error) {
    logger.error(error);

    await ctx.reply(ctx.t('add_animated-errors-tgs'));
  }
};

export default handleAnimatedSticker;
