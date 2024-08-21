import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import RoleModel from "../models/user-models/role.model";
import StatusModel from "../models/user-models/status.model";
import UserModel from "../models/user-models/user.model";

export class Setup {
  setup = async () => {
    try {
      await this.setupRoles();
      await this.setupUsers();
    } catch (error) {
      console.log(error);
    }
  };

  setupRoles = async () => {
    try {
      const roleCount = await RoleModel.estimatedDocumentCount();
      if (roleCount > 0) return;
      const roles = await Promise.all([
        new RoleModel({ name: "user" }).save(),
        new RoleModel({ name: "admin" }).save(),
        new RoleModel({ name: "banned" }).save(),
      ]);
      console.log(roles);
    } catch (error) {
      console.log(error);
    }
  };

  setupStatus = async (id: ObjectId): Promise<any> => {
    try {
      const newstatus = await new StatusModel({
        userid: id,
        status: "verified",
        active: true,
      }).save();

      const user = await UserModel.findByIdAndUpdate(
        id,
        { status: newstatus._id },
        { new: true }
      );
      return Promise.resolve(user);
    } catch (error) {
      console.log(error);
    }
  };

  setupUsers = async () => {
    try {
      const role = await RoleModel.findOne({ name: "admin" });
      const userRole = await RoleModel.findOne({ name: "user" });
      const user = await UserModel.findOne({
        role: role?._id,
      });
      if (!user) {
        let salt = bcrypt.genSaltSync(12);
        let password = bcrypt.hashSync("Admin123", salt);
        const newUser = await new UserModel({
          nickname: "Miguel Angel",
          email: "eagleheartangel88@gmail.com",
          password: password,
          image: "https://robohash.org/user0.png",
          role: role!.id,
        }).save();
        const updatedUser = await this.setupStatus(newUser._id);
        console.log(updatedUser);

        for (let i = 1; i <= 20; i++) {
          const nickname = `User${i}`;
          const email = `user${i}@example.com`;
          const password = bcrypt.hashSync(`Password${i}`, salt);
          const name = `Nombre${i} Apellido${i}`;

          const newUser = await new UserModel({
            nickname: nickname,
            email: email,
            password: password,
            role: userRole!.id,
            image: `https://robohash.org/user${i}.png`,
            name: name,
          }).save();

          await this.setupStatus(newUser._id);

          console.log(`Usuario ${i} creado: ${nickname}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
}
