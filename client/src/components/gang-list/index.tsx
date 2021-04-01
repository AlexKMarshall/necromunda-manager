/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTable, Row, CellValue } from "react-table";
import { useReadFactions } from "../../hooks/factions";
import { useCreateGang, useReadGangs } from "../../hooks/gangs";
import { stack, box, cluster } from "../../styles";
import { createGangDtoSchema, CreateGangDto } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { StandardFormControl } from "../form";
import { Link } from "react-router-dom";
import { ArrayElement } from "../../utils/types";

interface GangListProps {}

export function GangList(props: GangListProps) {
  const { isLoading, isError, error, gangs } = useReadGangs();
  const { factions } = useReadFactions();

  const { register, handleSubmit, errors, reset } = useForm<CreateGangDto>({
    resolver: zodResolver(createGangDtoSchema),
    defaultValues: {
      name: "",
      factionId: "",
    },
  });

  const { postGang } = useCreateGang();

  async function onSubmit(data: CreateGangDto) {
    await postGang(data);
    reset();
  }

  const data = useMemo(
    () =>
      gangs.map(({ id, name, faction: { name: factionName } }) => ({
        id,
        name,
        factionName,
      })),
    [gangs]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name" as const,
        Cell: ({
          row: { original },
          value,
        }: {
          row: Row<ArrayElement<typeof data>>;
          value: CellValue;
        }) => <Link to={`/gangs/${original.id}`}>{value}</Link>,
      },
      { Header: "Faction", accessor: "factionName" as const },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <div css={stack}>
      <h2>Gangs</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <pre>{JSON.stringify(error)}</pre>
      ) : (
        <table {...getTableProps()} css={box}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
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
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <form onSubmit={handleSubmit(onSubmit)} css={stack}>
        <StandardFormControl
          name="name"
          label="Name:"
          renderControlElement={(props) => (
            <input type="text" ref={register} {...props} />
          )}
          error={errors.name}
        />
        <StandardFormControl
          name="factionId"
          label="Faction:"
          renderControlElement={(props) => (
            <select ref={register} {...props}>
              {factions.map((faction) => (
                <option key={faction.id} value={faction.id}>
                  {faction.name}
                </option>
              ))}
            </select>
          )}
          error={errors.factionId}
        />
        <div css={cluster}>
          <div>
            <button type="submit">Add Gang</button>
          </div>
        </div>
      </form>
    </div>
  );
}
