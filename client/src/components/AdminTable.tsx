import { useTable } from "react-table";
import { Spinner, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";

interface AdminTableProps {
  columns: any;
  data: any;
  deleteButton: React.ComponentType<{ id: string }>;
}

export default function AdminTable({
  columns,
  data,
  deleteButton: DeleteButton,
}: AdminTableProps) {
  const renderDeleteButton = useCallback(
    ({ value }: { value: string }) =>
      value.startsWith("TEMP") ? <Spinner /> : <DeleteButton id={value} />,
    [DeleteButton]
  );

  const actionColumns = useMemo(
    () => [
      {
        Header: "Delete",
        accessor: "id" as const,
        Cell: renderDeleteButton,
      },
    ],
    [renderDeleteButton]
  );

  const tableColumns = useMemo(() => [...columns, ...actionColumns], [
    columns,
    actionColumns,
  ]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: tableColumns, data });

  return (
    <Table {...getTableProps} variant="simple" size="sm">
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
