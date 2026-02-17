export interface PaginationQuery {
  page?: number | string;
  limit?: number | string;
  month?: number | string;
  year?: number | string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC" | string;
  name?: string;
  regNum?: string;
}




