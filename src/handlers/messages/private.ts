import { InputFile } from 'grammy';
import { logger, MAX_STICKER_WEIGHT } from 'infrastructure';
import { generateSticker } from 'services/api';
import { MyContext } from 'types';


const handlePrivate = async (ctx: MyContext) => {
  const text = ctx.message.text;

  try {
    const ms = Date.now();
    const stickers = [];
    const stickersFromSettings = ctx.session.user.settings.private.stickers;

    for (const sticker of Object.keys(stickersFromSettings)) {
      stickers.push(await generateSticker(text, stickersFromSettings[sticker]));
    }

    for (const sticker of stickers) {
      if (!sticker) {return;}
      const weight = Number((sticker.length / 1024).toFixed(2));

      logger.debug(`weight: ${weight}KB`);
      if (weight > MAX_STICKER_WEIGHT) { continue; }

      await ctx.api.sendSticker(
        ctx.chat.id,
        new InputFile(sticker, 'private.tgs'),
        {
          reply_markup: {
            remove_keyboard: true,
          }
        }
      );

      ctx.session.stats.stickers_uploaded += 1;
    }
  } catch (error) {
    logger.error(error);
  }
};

export default handlePrivate;
