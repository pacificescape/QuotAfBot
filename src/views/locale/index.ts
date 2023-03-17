import { createView } from '@loskir/grammy-views';
import { InlineKeyboard } from 'grammy';
import { MyContext } from 'types';
import { startPrivateMessage } from 'handlers/commands/start';
import { MENU_LOCALES_ROW_WIDTH } from 'infrastructure/constants';
import { i18n, logger } from 'infrastructure';


export const LocaleMenuView = createView<MyContext>('locale-menu-view');

LocaleMenuView.onRender(async (ctx) => {
  const menu = new InlineKeyboard();

  i18n.locales.map((langCode, index) => {
    const languageName = i18n.fluent.translate(langCode, 'settings-locale-language-name');

    menu.text(languageName, `set-locale-${langCode}`);

    if ((index + 1) % MENU_LOCALES_ROW_WIDTH === 0) { menu.row(); }
  });

  ctx.reply(
    ctx.t('settings-locale'),
    {
      reply_markup: menu,
    },
  );
});

const setLocale = async (ctx: MyContext) => {
  const languageCode = ctx.match[1];

  ctx.session.user.locale = languageCode;
  ctx.i18n.useLocale(ctx.session.user.locale);

  await startPrivateMessage(ctx);
  await ctx.answerCallbackQuery({ text: ctx.t('settings-locale-changed') });

  logger.debug('setLocale', languageCode);
};

LocaleMenuView.global.callbackQuery(/set-locale-(.*)/, setLocale);

LocaleMenuView.global.command('lang', (ctx) => LocaleMenuView.enter(ctx));
LocaleMenuView.global.callbackQuery('locale-menu', (ctx) => LocaleMenuView.enter(ctx));
