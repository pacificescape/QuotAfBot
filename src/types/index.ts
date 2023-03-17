import { I18nFlavor } from '@grammyjs/i18n';
import { ViewContextFlavor } from '@loskir/grammy-views';
import { HydrateFlavor, HydrateApiFlavor } from '@grammyjs/hydrate';
import { Context as BaseContext, Api, SessionFlavor } from 'grammy';
import {
  Database,
  HydratedComponent,
  HydratedUser,
  IStats,
} from 'infrastructure';
import { File } from 'grammy/out/types';


interface SessionData {
  phoneNumber?: string;
  user?: HydratedUser;
  stats: Partial<IStats> & { category?: string };
  component?: HydratedComponent;
}

interface DatabaseContext {
  db: typeof Database;
}

type MyContext = BaseContext &
  HydrateFlavor<BaseContext> &
  SessionFlavor<SessionData> &
  I18nFlavor &
  ViewContextFlavor &
  DatabaseContext;

type MyApi = HydrateApiFlavor<Api>;

export { MyContext, MyApi, SessionData };
export * from './lottie';
export type AnimatedStickerFile = File & { componentUniqueId: string };
