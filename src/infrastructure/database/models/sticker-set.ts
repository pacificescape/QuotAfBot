import { Document, HydratedDocument, Schema } from 'mongoose';


export interface IStickerSet extends Document {
  user_id: number;
  name: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export type HydratedStickerSet = HydratedDocument<IStickerSet>;

export const StickerSet = new Schema({
  user_id: Number,
  name: String,
  title: String,
}, {
  timestamps: true,
});
