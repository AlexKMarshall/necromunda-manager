/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { CellValue, Row, useTable } from "react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useReadTraits,
  useCreateTrait,
  useDeleteTrait,
} from "../../../hooks/traits";
import { box, stack, cluster } from "../../../styles";
import { StandardFormControl } from "../../form";
import { ArrayElement } from "../../../utils/types";
import { Trait, CreateTraitDto, createTraitDtoSchema } from "../../../schemas";

interface TraitAdminProps {}
export function TraitAdmin(props: TraitAdminProps) {
  const { isLoading, isError, error, traits } = useReadTraits();

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
          row: Row<ArrayElement<typeof traits>>;
          value: CellValue;
        }) => (
          <div>
            {original.loading ? (
              <span aria-label="loading">Spinner</span>
            ) : (
              <DeleteTraitButton
                id={value}
                label={`Delete Trait ${original.name}`}
              />
            )}
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: traits });

  const { register, handleSubmit, errors, reset } = useForm<CreateTraitDto>({
    defaultValues: { name: "" },
    resolver: zodResolver(createTraitDtoSchema),
  });
  const { postTrait } = useCreateTrait();

  async function onSubmit(data: CreateTraitDto) {
    await postTrait(data);
    reset();
  }
  return (
    <div css={stack}>
      <h2>Traits</h2>
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
          label="Trait Name:"
          name="name"
          renderControlElement={(props) => (
            <input type="text" ref={register} {...props} />
          )}
          error={errors.name}
        />
        <div css={cluster}>
          <div>
            <button type="submit">Add Trait</button>
          </div>
        </div>
      </form>
    </div>
  );
}

interface DeleteTraitButtonProps {
  id: Trait["id"];
  label: string;
}
function DeleteTraitButton({ id, label }: DeleteTraitButtonProps) {
  const { deleteTrait } = useDeleteTrait(id);
  return (
    <button onClick={deleteTrait} aria-label={label}>
      Delete
    </button>
  );
}
