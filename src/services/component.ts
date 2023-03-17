import { gzip, ungzip } from 'node-gzip';
import { CHANNEL_LOG_ID, logger } from 'infrastructure';
import { Database, HydratedComponent } from 'infrastructure/database';
import { normalizeSticker, wrapLayers } from 'services/sticker';
import getFile from 'utils/get-file';
import { MyContext } from 'types';
import { InputFile } from 'grammy';

import { generateComponent } from './api';


export const createComponent = async (ctx: MyContext) => {
  const user = ctx.session.user;
  const sticker = ctx.message.sticker;

  try {
    const fileBuffer = await getFile(sticker.file_id);
    const buffer = await ungzip(fileBuffer);
    const json = JSON.parse(buffer.toString('utf8'));

    const normalized = normalizeSticker(json);

    normalized.json = wrapLayers(normalized.json, sticker.file_unique_id);

    let component = await Database.Component.findOne({ file_unique_id: sticker.file_unique_id });

    if (component) {
      component.emoji = sticker.emoji;
      component.set_name = sticker.set_name;
    } else {
      component = new Database.Component();

      component.file_unique_id = sticker.file_unique_id;
      component.file_id = sticker.file_id;
      component.user = user;
      component.assets = await gzip(JSON.stringify(normalized.json));
      component.options = {};
      component.emoji = sticker.emoji || '';
      component.set_name = sticker.set_name || '';
    }


    const checkedMessage = await checkComponent(ctx, component, normalized);

    await component.save();

    return { message: checkedMessage, component };
  } catch (error) {
    logger.error(error);
  }
};

const checkComponent = async (
  ctx: MyContext,
  component: HydratedComponent,
  normalized: object,
) => {
  let sticker: Buffer;

  if (component.blackList) {
    throw new Error('Animated sticker is prohibited');
  }

  try {
    sticker = await generateComponent(component.file_unique_id, normalized);

    if (!sticker) {
      throw new Error('GENERATE_TEST_STICKER_FAILED: ' + component.file_unique_id);
    }

    const message = await ctx.api.sendSticker(
      ctx.chat.id,
      new InputFile(sticker, component.file_unique_id + '.tgs'),
    );

    if (!message.sticker) {
      await ctx.api.deleteMessage(ctx.chat.id, message.message_id).catch(() => {});
      component.error = true;

      throw new Error('TGS_IS_NOT_STICKER', { cause: message });
    }

    component.error = false;
    ctx.session.stats.stickers += 1;

    return message;
  } catch (error) {
    component.error = true;

    logger.error(error);
    await handleCheckError(ctx, sticker); // TODO fix handler
  }
};

const handleCheckError = async (ctx: MyContext, sticker: Buffer) => {
  try {
    const report = await ctx.api.sendSticker(CHANNEL_LOG_ID, ctx.message.sticker.file_id);

    await ctx.api.sendDocument(
      CHANNEL_LOG_ID,
      new InputFile(await ungzip(sticker), 'source.json'),
      {
        caption: ctx.message.sticker.file_unique_id,
        reply_to_message_id: report.message_id,
      },
    );
  } catch (error) {
    logger.error(error);
  }
};

export const findByEmoji = async (emoji: string, skip = 0) => {
  const components = await Database.Component
    .find({ emoji })
    .skip(skip)
    .limit(40);

  return components;
};
