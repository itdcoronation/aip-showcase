import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReferralTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const ReferralTable = <TData, TValue>({
  columns,
  data,
}: ReferralTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader className="" >
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow className="bg-bg-secondary !border-b-0" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  style={{ width: header.getSize(), margin: "0" }}
                  key={header.id}
                  className="h-8 text-[#666D80] text-xs [&:last-of-type]:text-right"
                >
                  {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                    )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="[&_tr:last-child]:border-b-1" >
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              className="text-txt-secondary border-stroke-primary"
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell style={{ width: cell.column.getSize() }} key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export { ReferralTable };
