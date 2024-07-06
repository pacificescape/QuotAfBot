import { hears } from '@grammyjs/i18n';
import { ViewController } from '@loskir/grammy-views';
import { Bot } from 'grammy';
import { startPrivateMessage } from 'handlers/commands/start';
import { MyContext } from 'types';

import { NewComponentView } from './animated';
import { LocaleMenuView } from './locale';
import { DonateView } from './donate';


export const MainViewController = new ViewController<MyContext>();
const toLeave = async (ctx: MyContext) => {
  ctx.view.state = {};
  await ctx.view.leave();
  await startPrivateMessage(ctx);
};

MainViewController.errorBoundary((error) => {
  console.log(error.name);
});

MainViewController.register(
  LocaleMenuView,
  NewComponentView,
  DonateView,
);

MainViewController.filter(hears('keyboard-cancel'), toLeave);
MainViewController.command(['start', 'cancel'], toLeave);
MainViewController.callbackQuery(['cancel'], toLeave);

const setup = async (bot: Bot<MyContext>) => {
  bot.use(MainViewController);
};

export default { setup };
