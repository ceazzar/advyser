export function normalize(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase()
}

export function includesQuery(value: string | null | undefined, query: string): boolean {
  return normalize(value).includes(normalize(query))
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.max(1, Math.min(page, totalPages))
  const offset = (safePage - 1) * pageSize

  return {
    items: items.slice(offset, offset + pageSize),
    pagination: {
      page: safePage,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  }
}
