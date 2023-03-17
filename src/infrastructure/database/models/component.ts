import { Document, HydratedDocument, Schema } from 'mongoose';

import { IUser } from './user';


export interface IComponent extends Document {
  user: IUser;
  file: any;
  file_unique_id: string;
  file_id: string;
  success: boolean;
  emoji: string;
  set_name: string;
  blackList: boolean;
  assets: Buffer | string;
  options: any;
  stats: {
    uses: number;
    installs: number;
  };
  error: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type HydratedComponent = HydratedDocument<IComponent>;


export const ComponentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  file: {},
  file_unique_id: {
    type: String,
    unique: true,
    index: true,
  },
  file_id: {
    type: String,
    unique: true,
  },
  success: Boolean,
  emoji: String,
  set_name: String,
  blackList: {
    type: Boolean,
    default: false,
    index: true,
  },
  assets: Buffer || String,
  options: {},
  stats: {
    uses: Number,
    installs: Number,
  },
  error: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});
