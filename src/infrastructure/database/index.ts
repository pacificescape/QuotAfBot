import connection from './connection';
import middleware from './middleware';
import {
  IUser,
  UserSchema,
  IStats,
  StatsSchema,
  IComponent,
  ComponentSchema,
  StickerSet,
  StickerSchema,
  ISticker,
  IStickerSet,
} from './models';


export const Database = {
  connection,
  User: connection.model<IUser>('User', UserSchema),
  Pack: connection.model<IStickerSet>('StickerSet', StickerSet),
  Stats: connection.model<IStats>('Stats', StatsSchema),
  Sticker: connection.model<ISticker>('Sticker', StickerSchema),
  Component: connection.model<IComponent>('Component', ComponentSchema),
};

export const dbMiddleware = middleware(Database);

export * from './models';
