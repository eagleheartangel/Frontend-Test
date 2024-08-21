import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import { v4 as uuidv4 } from "uuid";

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
export class Role {
  @prop({ default: uuidv4, trim: true, unique: true })
  uid: string;

  @prop({ trim: true, unique: true })
  name: string;
}

const RoleModel = getModelForClass(Role);
export default RoleModel;
