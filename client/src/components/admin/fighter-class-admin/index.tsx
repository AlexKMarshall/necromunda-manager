/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { useTable, Row, CellValue } from "react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useReadFighterClasses,
  useCreateFighterClass,
  useDeleteFighterClass,
} from "../../../hooks/fighter-classes";
import { box, stack, cluster } from "../../../styles";
import { StandardFormControl } from "../../form";
import { ArrayElement } from "../../../utils/types";
import { FighterClass } from "../../../schemas";

const addFighterClassFormSchema = z.object({
  name: z.string().nonempty({ message: "Required" }),
});
type AddFighterClassForm = z.infer<typeof addFighterClassFormSchema>;

interface FighterClassAdminProps {}
export function FighterClassAdmin(props: FighterClassAdminProps) {
  const { isLoading, isError, error, fighterClasses } = useReadFighterClasses();
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
          row: Row<ArrayElement<typeof fighterClasses>>;
          value: CellValue;
        }) => (
          <div>
            {original.loading ? (
              <span aria-label="loading">Spinner</span>
            ) : (
              <DeleteFighterClassButton
                id={original.id}
                label={`Delete Fighter Class ${original.name}`}
              />
            )}
          </div>
        ),
      },
    ],
    []
  );
  const { register, handleSubmit, errors, reset } = useForm<
    AddFighterClassForm
  >({
    defaultValues: { name: "" },
    resolver: zodResolver(addFighterClassFormSchema),
  });
  const { postFighterClass } = useCreateFighterClass();

  async function onSubmit(data: AddFighterClassForm) {
    await postFighterClass(data);
    reset();
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: fighterClasses });
  return (
    <div css={stack}>
      <h2>Fighter Classes</h2>
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
          label="Fighter Class Name:"
          name="name"
          renderControlElement={(props) => (
            <input type="text" ref={register} {...props} />
          )}
          error={errors.name}
        />
        <div css={cluster}>
          <div>
            <button type="submit">Add Fighter Class</button>
          </div>
        </div>
      </form>
    </div>
  );
}

interface DeleteFighterClassButtonProps {
  id: FighterClass["id"];
  label: string;
}
function DeleteFighterClassButton({
  id,
  label,
}: DeleteFighterClassButtonProps) {
  const { deleteFighterClass } = useDeleteFighterClass(id);
  return (
    <button onClick={() => deleteFighterClass()} aria-label={label}>
      Delete
    </button>
  );
}
