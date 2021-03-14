import { useMemo } from "react";
import { useTable } from "react-table";

interface WeaponStatsDisplay {
  rng: {
    s: string;
    l: string;
  };
  acc: {
    s: string;
    l: string;
  };
  str: string;
  ap: string;
  d: string;
  am: string;
  traits: string;
}

export interface WeaponsListProps {
  weapons: { name: string; stats: WeaponStatsDisplay }[];
}

export function WeaponsList({ weapons }: WeaponsListProps) {
  const data = useMemo(
    () => weapons.map(({ name, stats }) => ({ name, ...stats })),
    [weapons]
  );
  const columns: any = useMemo(
    () => [
      { Header: "Weapon", accessor: "name" as const },
      {
        Header: "Rng",
        columns: [
          { Header: "S", accessor: "rng.s" as const },
          { Header: "L", accessor: "rng.l" as const },
        ],
      },
      {
        Header: "Acc",
        columns: [
          { Header: "S", accessor: "acc.s" as const },
          { Header: "L", accessor: "acc.l" as const },
        ],
      },
      {
        Header: "Str",
        accessor: "str" as const,
      },
      { Header: "AP", accessor: "ap" as const },
      { Header: "D", accessor: "d" as const },
      { Header: "Am", accessor: "am" as const },
      { Header: "Traits", accessor: "traits" as const },
    ],
    []
  );

  function getColumnClassName(columnId: string) {
    const textAlign = ["traits", "name"].includes(columnId)
      ? "text-left"
      : "text-center";
    const border = ["rng.l", "acc.l"].includes(columnId) ? "border-none" : "";
    return `${textAlign} ${border}`;
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                className={getColumnClassName(column.id)}
              >
                {column.render("Header")}
              </th>
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
                <td
                  {...cell.getCellProps()}
                  className={getColumnClassName(cell.column.id)}
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
