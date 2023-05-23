export function buildselectTableColumnsQuery(table: string) {
  return `
        SELECT column_name
            FROM information_schema.columns
            WHERE table_name = '${table}';
    `;
}

export function buildSelectTableDataQuery(
  table: string,
  requestedFields?: string[],
  limit?: number,
  offset?: number,
) {
  let query = 'SELECT ';
  if (!requestedFields) {
    query += '*';
  } else {
    const fields = requestedFields.map((field) => `"${field}"`).join(', ');
    query += fields;
  }

  query += ` FROM ${table}`;

  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  if (offset) {
    query += ` OFFSET ${offset}`;
  }

  return query;
}

export function buildSelectTableDataCountQuery(table: string) {
  return `SELECT COUNT(*) FROM ${table}`;
}
