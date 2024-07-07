import { HydratedDocument, Schema } from 'mongoose';
import { DefaultStickers } from 'infrastructure';

import { ISticker } from './sticker';
import { IStickerSet } from './sticker-set';


export interface IUser {
  telegram_id: number;
  username: string;
  first_name: string;
  last_name: string;
  locale: string;
  packs: IStickerSet[];
  stickers: ISticker[];
  started: boolean;
  stats: {
    stickers: number;
    packs: number;
    inline: number;
  };
  settings: {
    private: {
      stickers: Record<string, [string, string, string]>;
    };
    inline: {
      stickers: Record<string, [string, string, string]>;
    };
  };
  tempStickerSet: {
    created: boolean;
    name: string;
  };
  blocked: boolean;
  donate: boolean;
  stars: number;
  createdAt: Date;
  updatedAt: Date;
}

export type HydratedUser = HydratedDocument<IUser>;

export const UserSchema = new Schema<IUser>({
  telegram_id: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  username: String,
  first_name: String,
  last_name: String,
  locale: {
    type: String,
  },
  packs: [{
    type: Schema.Types.ObjectId,
    ref: 'Pack',
  }],
  stickers: [{
    type: Schema.Types.ObjectId,
    ref: 'Sticker',
  }],
  started: {
    type: Boolean,
    default: false,
  },
  stats: {
    stickers: {
      type: Number,
      default: 0,
    },
    packs: {
      type: Number,
      default: 0,
    },
    inline: {
      type: Number,
      default: 0,
    },
  },
  settings: {
    private: {
      stickers: {
        type: Object,
        default: DefaultStickers.private,
      },
    },
    inline: {
      stickers: {
        type: Object,
        default: DefaultStickers.inline,
      },
    },
  },
  tempStickerSet: {
    created: {
      type: Boolean,
      default: false,
    },
    name: String,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  donate: {
    type: Boolean,
    default: false,
  },
  stars: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});
