import { Composer } from 'grammy';
import { lruCache } from 'infrastructure';
import { MyContext } from 'types';

import {
  deleteInlineHandler,
  generateInlineHandler,
  generateRandomHandler,
} from './generate';


async function setup (composer: Composer<MyContext>) {
  composer.inlineQuery(/.+/, async (ctx) => {
    const match = ctx.inlineQuery.query.match(/^(standard|delete|random)::([\S\s]*)/);

    if (match) {
      if (match[1] === 'random') {
        return await generateRandomHandler(ctx, match[2]);
      }
      if (match[1] ==='delete') {
        const from = match[2] === 'private' ? 'private' : 'inline';
        return await deleteInlineHandler(ctx, from)
      }
    }

    await generateInlineHandler(ctx);
  });

  composer.on('chosen_inline_result', async (ctx) => {
    const result = lruCache.get(ctx.chosenInlineResult.result_id);

    if (!result) {
      return;
    }

    if (result.type === 'favorite') {
      // TODO: update stats
    }

    console.log(result);
  });
}

export default { setup };
