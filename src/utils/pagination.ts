interface PaginationResult<T> {
  todos: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export { PaginationResult };