import path from 'path';

import { I18n } from '@grammyjs/i18n';
import { MyContext } from 'types';

import setCommands from './set-commands';


export const i18n = new I18n({
  defaultLocale: 'en',
  directory: path.resolve(__dirname, 'locales'),
  localeNegotiator: (ctx: MyContext) =>
    ctx.session.user.locale ?? ctx.from?.language_code ?? 'en',
});

// setCommands();

