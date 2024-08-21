export interface PaginateResult<T> {
  users: T[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}
