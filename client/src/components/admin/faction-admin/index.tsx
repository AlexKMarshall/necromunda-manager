/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { useTable } from "react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useReadFactions, useCreateFaction } from "../../../hooks/factions";
import { box, stack, stackSmall, cluster } from "../../../styles";
import { StandardFormControl } from "../../form";

const addFactionFormSchema = z.object({
  name: z.string().nonempty({ message: "Required" }),
});
type AddFactionForm = z.infer<typeof addFactionFormSchema>;

interface FactionAdminProps {}
export function FactionAdmin(props: FactionAdminProps) {
  const columns = useMemo(
    () => [{ Header: "Name", accessor: "name" as const }],
    []
  );
  const { isLoading, isError, error, factions } = useReadFactions();
  const { register, handleSubmit, errors, reset } = useForm<AddFactionForm>({
    defaultValues: { name: "" },
    resolver: zodResolver(addFactionFormSchema),
  });
  const { postFaction } = useCreateFaction();

  async function onSubmit(data: AddFactionForm) {
    await postFaction(data);
    reset();
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: factions });
  return (
    <div css={stack}>
      <h2>Factions</h2>
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
          label="Name:"
          name="name"
          renderControlElement={(props) => (
            <input type="text" ref={register} {...props} />
          )}
          error={errors.name}
        />
        <div css={cluster}>
          <div>
            <button type="submit">Add Faction</button>
          </div>
        </div>
      </form>
    </div>
  );
}
