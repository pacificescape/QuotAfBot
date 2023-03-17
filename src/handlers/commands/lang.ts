import { Composer } from 'grammy';
import { MyContext } from 'types';
import { isPrivate } from 'filters';
import { LocaleMenuView } from 'views/locale';


async function setup (composer: Composer<MyContext>) {
  composer.filter(isPrivate).command('lang', (ctx) => LocaleMenuView.enter(ctx));
}

export default { setup };
