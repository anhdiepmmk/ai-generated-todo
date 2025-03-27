interface PaginationResult<T> {
  todos: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

function getPaginationResult<T>(
  todos: T[],
  page: number,
  limit: number,
  count: number
): PaginationResult<T> {
  return {
    todos,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
}

export { getPaginationResult, PaginationResult };