import { randomUUID } from 'crypto';

import { InputFile } from 'grammy';
import { InlineQueryResultCachedSticker } from '@grammyjs/types';
import { AnimatedStickerFile, MyContext } from 'types';
import { generateSticker } from 'services/api';
import {
  DefaultStickers,
  HydratedComponent,
  INLINE_OFFSET_LENGTH,
  INLINE_TIMEOUT,
  logger,
  lruCache,
  MAX_OFFSET_LENGTH,
} from 'infrastructure';
import { uploadAnimatedStickerFile } from 'utils';
import { GenerateInlineCacheOptions } from 'types/inline';


const limiter = {};

export const generateInlineHandler = async (ctx: MyContext) => {
  const id = ctx.from.id;
  const text = ctx.inlineQuery.query;
  const offset = Number(ctx.inlineQuery.offset);
  const stickers = ctx.session.user.settings.inline.stickers;

  if (offset === 0) { clearTimeout(limiter[id]); }
  if (text === '') { return; }
  if (Object.keys(stickers).length === 0) {
    logger.debug('handle empty stickers settings');
  }

  const stickerTypes = Object.entries(stickers).map((t) => t[1]);

  limiter[id] = setTimeout(() =>
    generateInline(ctx, text, stickerTypes, offset, { type: 'random' }),
  INLINE_TIMEOUT,
  );
};

export const generateRandomHandler = async (ctx: MyContext, matchedText?: string) => {
  const id = ctx.from.id;
  const text = matchedText || ctx.inlineQuery.query;
  const offset = Number(ctx.inlineQuery.offset);

  if (offset === 0) { clearTimeout(limiter[id]); }
  if (offset >= MAX_OFFSET_LENGTH) { return; }
  if (text === '') { return; }

  const components = await ctx.db.Component.aggregate<HydratedComponent>([
    { $match: { file_unique_id: { $ne: null }, error: false } },
    { $sample: { size: INLINE_OFFSET_LENGTH } },
  ]);

  const stickerTypes = components
    .filter((c) => c.file_unique_id)
    .map(({ file_unique_id }) => [
      file_unique_id,
      ...DefaultStickers.component,
    ]);

  limiter[id] = setTimeout(() =>
    generateInline(ctx, text, stickerTypes, 0, { type: 'random' }),
  INLINE_TIMEOUT,
  );
};

export const deleteInlineHandler = async (ctx: MyContext, from: 'private' | 'inline') => {
  const id = ctx.from.id;
  const text = ctx.inlineQuery.query;
  const offset = Number(ctx.inlineQuery.offset);
  const stickers = ctx.session.user.settings.inline.stickers;

  if (offset === 0) { clearTimeout(limiter[id]); }
  if (text === '') { return; }
  if (Object.keys(stickers).length === 0) {
    logger.debug('handle empty stickers settings');
  }

  const stickerTypes = Object.entries(stickers).map((t) => t[1]);

  limiter[id] = setTimeout(() =>
    generateInline(ctx, text, stickerTypes, offset, { type: 'delete', from }),
  INLINE_TIMEOUT,
  );
};

const generateInline = async (
  ctx: MyContext,
  text: string,
  stickerTypes: string[][],
  offset: number,
  cacheType: GenerateInlineCacheOptions,
) => {
  logger.debug(`inlineQuery: ${text}`);

  const tgsFiles = {};

  for (let i = offset; i < offset + INLINE_OFFSET_LENGTH; i++) {
    const type = stickerTypes[i];

    if (!type) { continue; }

    const fileUniqueId = type[0];

    const sticker = await generateSticker(text, type);

    if (!sticker) { continue; }

    const weight = Number((sticker.length / 1024).toFixed(2));

    logger.debug(['weight:', weight, 'KB']);

    if (weight >= 64) { continue; }

    tgsFiles[fileUniqueId] = sticker;
  }

  const promises: Promise<AnimatedStickerFile>[] = [];

  for (const type in tgsFiles) {
    const tgsFile = tgsFiles[type];

    if (!tgsFile) { continue; }

    promises.push(uploadAnimatedStickerFile(ctx.inlineQuery.from.id, new InputFile(tgsFile, type)));
  }

  const files = await Promise.allSettled(promises);

  const erroredComponents = [];

  const stickerFiles = files
    .map((promise) => {
      if (promise.status === 'rejected') {
        logger.debug(promise?.reason?.message);

        const file_unique_id = promise.reason.payload?.sticker?.filename;

        if (file_unique_id) {
          erroredComponents.push(file_unique_id);
        }

        return;
      }

      return promise.value;
    })
    .filter(Boolean);

  ctx.session.stats.stickers_uploaded += stickerFiles.length;

  const inlineResults: InlineQueryResultCachedSticker[] = stickerFiles.map(
    (file) => ({
      id: randomUUID(),
      type: 'sticker',
      sticker_file_id: file.file_id,
    }),
  );

  const updateErroredPromise = ctx.db.Component.updateMany(
    { file_unique_id: erroredComponents },
    { error: true },
  );

  if (inlineResults.length === 0) {
    await updateErroredPromise;
    return;
  }

  await ctx.answerInlineQuery(
    inlineResults,
    {
      switch_pm_text: ctx.t('more_stickers'),
      switch_pm_parameter: '-',
      cache_time: 0,
      next_offset: String(Number(ctx.inlineQuery.offset) + INLINE_OFFSET_LENGTH),
    },
  ).catch(logger.error);

  for (const inlineResult of inlineResults) {
    const file = stickerFiles.find((file) => file.file_id === inlineResult.sticker_file_id);

    if (!file) { continue; }

    lruCache.setInlineSticker({
      ...cacheType,
      stickerFileUniqueId: file.file_unique_id,
      componentUniqueId: file.componentUniqueId,
    });
  }

  await updateErroredPromise;
};
