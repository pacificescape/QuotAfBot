import { Composer } from 'grammy';
import { MyContext } from 'types';
import { isPrivate } from 'filters';
import { DonateView } from 'views/donate';


async function setup (composer: Composer<MyContext>) {
  composer.filter(isPrivate).command('donate', (ctx) => DonateView.enter(ctx));
}

export default { setup };
