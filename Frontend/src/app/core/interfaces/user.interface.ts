export interface UserResponseInterface {
  status: number;
  token: string;
  user: UserInterface;
}

export interface PaginatedUserResponseInterface {
  status: number;
  data: PaginatesUsersInterface;
}

export interface PaginatesUsersInterface {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  users: UserInterface[];
}

export interface SigninInterface {
  status: number;
  data: UserIdentityInterface;
}

export interface UserIdentityInterface {
  token: string | null;
  user: UserInterface | null;
}

export interface UserInterface {
  uid: string;
  nickname: string;
  email: string;
  image?: string;
  role?: Role;
  status?: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  uid: string;
  name: string;
}

export interface Status {
  uid: string;
  userid: string;
  status: string;
  code: string;
}
