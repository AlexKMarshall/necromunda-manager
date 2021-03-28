import { useMemo } from "react";
import { useTable } from "react-table";
import { FighterSummary } from "../../types/fighter";

interface FighterListProps {
  fighters: FighterSummary[];
}

export function FighterList({ fighters }: FighterListProps) {
  const data = fighters;
  const columns = useMemo(
    () => [
      { Header: "Fighter Name", accessor: "name" as const },
      { Header: "Type", accessor: "fighterPrototype" as const },
      { Header: "Cost", accessor: "cost" as const },
      { Header: "Experience", accessor: "xp" as const },
      { Header: "Advancements", accessor: "advancements" as const },
      { Header: "Recovery", accessor: "recovery" as const },
      { Header: "Captured By", accessor: "capturedBy" as const },
      { Header: "Lasting Injuries", accessor: "lastingInjuries" as const },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} style={{ width: "100%" }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
