import UserModel from "../models/user-models/user.model";
import { PaginateResult } from "../interfaces/paginate.interface";

export class PaginationService {
  async getUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginateResult<any>> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find()
        .populate("role", "status")
        .sort([["createdAt", "descending"]])
        .skip(skip)
        .limit(limit)
        .exec(),
      UserModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      currentPage: page,
      totalPages,
      totalUsers: total,
    };
  }
}
