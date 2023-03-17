import { Document, HydratedDocument, Schema } from 'mongoose';

import { IUser } from './user';


export interface ISticker extends Document {
  file_id: string;
  query: string;
  type: string;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export type HydratedSticker = HydratedDocument<ISticker>;

export const StickerSchema = new Schema({
  file_id: String,
  query: String,
  type: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});
