import { Document, HydratedDocument, Schema, Types } from 'mongoose';


export interface IStats extends Document {
  stickers_uploaded: number;

  inline_queries: number;

  callback_queries: number;

  private_messages: number;

  DAU: Types.ObjectId[];

  users_count: number;

  createdAt: Date;

  updatedAt: Date;
}


export type HydratedStats = HydratedDocument<IStats>;


export const StatsSchema = new Schema({
  stickers_uploaded: {
    type: Number,
    default: 0,
  },
  inline_queries: {
    type: Number,
    default: 0,
  },
  callback_queries: {
    type: Number,
    default: 0,
  },
  private_messages: {
    type: Number,
    default: 0,
  },
  DAU: [{
    type: Types.ObjectId,
  }],
  users_count: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});
