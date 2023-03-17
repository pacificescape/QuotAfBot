import { Document, HydratedDocument, Schema } from 'mongoose';


export interface IStats extends Document {
  date: Date;
  all_users: number;
  stickers: number;
  stickers_uploaded: number;
  packs: number;
  inline: number;
  private: number;
  users: number;
  generated: number;
  latency: number;
  usersCount: number;
  createdAt: Date;
  updatedAt: Date;
}


export type HydratedStats = HydratedDocument<IStats>;


export const StatsSchema = new Schema({
  date: Date,
  all_users: Number,
  stickers: {
    type: Number,
    default: 0,
  },
  stickers_uploaded: {
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
  private: {
    type: Number,
    default: 0,
  },
  users: [{
    type: Number,
    default: 0,
  }],
  generated: {
    type: Number,
    default: 0,
  },
  latency: {
    type: Number,
    default: 0,
  },
  usersCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});
