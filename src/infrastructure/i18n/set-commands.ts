import bot from 'bot';

import { i18n } from '.';


const setCommands = async () => {
  await bot.api.setChatMenuButton({
    menu_button: {
      type: 'commands',
    },
  });

  for (const locale of i18n.locales) {
    bot.api.setMyCommands(
      [
        {
          command: 'start',
          description: i18n.fluent.withLocale(locale)('commands-start'),
        },
        {
          command: 'lang',
          description: i18n.fluent.withLocale(locale)('commands-lang'),
        },
        {
          command: 'delete',
          description: i18n.fluent.withLocale(locale)('commands-delete'),
        },
        {
          command: 'donate',
          description: i18n.fluent.withLocale(locale)('commands-donate'),
        },
      ],
      {
        language_code: locale,
        scope: {
          type: 'all_private_chats',
        },
      }).catch(console.error);
  }
};

export default setCommands;
