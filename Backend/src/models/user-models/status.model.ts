import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        ret.uid = ret._id;
        delete ret._id;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        ret.uid = ret._id;
        delete ret._id;
      },
    },
  },
})
export class Status {
  @prop({ default: uuidv4, trim: true })
  uid: string;

  @prop({ trim: true })
  userid: string;

  @prop({ trim: true })
  status: string;

  @prop({ trim: true, unique: false })
  code: string;
}

const StatusModel = getModelForClass(Status);
export default StatusModel;
