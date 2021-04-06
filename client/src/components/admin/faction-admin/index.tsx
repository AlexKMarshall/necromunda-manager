/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { CellValue, Row, useTable } from "react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useReadFactions,
  useCreateFaction,
  useDeleteFaction,
} from "../../../hooks/factions";
import { box, stack, cluster } from "../../../styles";
import { StandardFormControl } from "../../form";
import { ArrayElement } from "../../../utils/types";
import { Faction } from "../../../schemas";

const addFactionFormSchema = z.object({
  name: z.string().nonempty({ message: "Required" }),
});
type AddFactionForm = z.infer<typeof addFactionFormSchema>;

interface FactionAdminProps {}
export function FactionAdmin(props: FactionAdminProps) {
  const { isLoading, isError, error, factions } = useReadFactions();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useFactionTable(factions);

  const { register, errors, createFaction } = useAddFactionForm();
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
      <form onSubmit={createFaction} css={stack}>
        <StandardFormControl
          label="Faction Name:"
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

interface DeleteFactionButtonProps {
  id: Faction["id"];
  name: Faction["name"];
}
function DeleteFactionButton({ id, name }: DeleteFactionButtonProps) {
  const { deleteFaction } = useDeleteFaction(id);
  return (
    <button onClick={deleteFaction} aria-label={`delete faction ${name}`}>
      Delete
    </button>
  );
}

function useFactionTable(
  factions: ReturnType<typeof useReadFactions>["factions"]
) {
  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name" as const },
      {
        Header: "Actions",
        accessor: "id" as const,
        Cell: ({
          row: { original },
          value,
        }: {
          row: Row<ArrayElement<typeof factions>>;
          value: CellValue;
        }) => (
          <div>
            {original.loading ? (
              <span aria-label="loading">Spinner</span>
            ) : (
              <DeleteFactionButton id={value} name={original.name} />
            )}
          </div>
        ),
      },
    ],
    []
  );

  return useTable({ columns, data: factions });
}

function useAddFactionForm() {
  const useFormReturn = useForm<AddFactionForm>({
    defaultValues: { name: "" },
    resolver: zodResolver(addFactionFormSchema),
  });
  const { postFaction } = useCreateFaction();

  const createFaction = useFormReturn.handleSubmit(async (faction) => {
    await postFaction(faction);
    useFormReturn.reset();
  });

  return { ...useFormReturn, createFaction };
}
