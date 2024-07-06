import { createView } from '@loskir/grammy-views';
import { InlineKeyboard } from 'grammy';
import { MyContext } from 'types';

const amounts = [10, 25, 50, 100, 150, 200, 250];

export const DonateView = createView<MyContext>('donate-view');

DonateView.onRender(async (ctx) => {
  const menu = new InlineKeyboard(amounts.map((amount) => [
      {
        text: ctx.t('stars-donate-stars-amount', { amount }),
        callback_data: `donate:${amount}`,  
      },
  ]));

  ctx.reply(
    ctx.t('stars-donate-text'),
    {
      reply_markup: menu,
    },
  );
});

const sendInvoice = async (ctx: MyContext) => {
  const amount = Number(ctx.match[0].split(':')[1]);

  ctx.api.sendInvoice(
    ctx.chat.id,
    ctx.t('stars-donate-invoice-title', { amount }),
    ctx.t('stars-donate-invoice-description'),
    `donate:${ctx.chat.id}:${amount}`,
    '',
    'XTR',
    [{ label: 'Donation', amount }],
  )
}

DonateView.global.command('donate', (ctx) => DonateView.enter(ctx));
DonateView.global.callbackQuery(/donate:\d+/, sendInvoice);
DonateView.global.callbackQuery('donate', (ctx) => DonateView.enter(ctx));
