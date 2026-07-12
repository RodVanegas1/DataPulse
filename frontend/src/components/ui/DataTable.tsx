interface DataTableProps {
  columns: string[];
  rows: Array<Record<string, string | number | null | undefined>>;
}

export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-steel-500">
          <tr>
            {columns.map((column) => (
              <th className="px-4 py-3 font-semibold" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row, index) => (
            <tr className="hover:bg-white/[0.03]" key={`${row.slug ?? row.name}-${index}`}>
              {columns.map((column) => (
                <td className="whitespace-nowrap px-4 py-3 text-steel-300" key={column}>
                  {row[column] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
