import { Update } from '@grammyjs/types';


const allowedUpdates: ReadonlyArray<Exclude<keyof Update, 'update_id'>> = [
  'message',
  'inline_query',
  'chosen_inline_result',
  'callback_query',
];

export default allowedUpdates;
