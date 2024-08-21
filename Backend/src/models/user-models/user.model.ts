import {
  prop,
  modelOptions,
  getModelForClass,
  Ref,
} from "@typegoose/typegoose";
import { Role } from "./role.model";
import { v4 as uuidv4 } from "uuid";
import { Status } from "./status.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        ret.uid = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        ret.uid = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  },
})
class User {
  @prop({ default: uuidv4, trim: true })
  uid: string;

  @prop({ required: true, trim: true, unique: true })
  nickname: string;

  @prop({ required: true, trim: true, unique: true })
  email: string;

  @prop({ required: true, trim: true })
  password: string;

  @prop({ trim: true })
  image: string;

  @prop({ trim: true })
  imageid: string;

  @prop({ ref: () => Role })
  role: Ref<Role>;

  @prop({ ref: () => Status })
  status: Ref<Status>;
}

const UserModel = getModelForClass(User);
export default UserModel;
