import { useMemo, useState } from "react";
import { FieldValues, useForm, UseFormOptions } from "react-hook-form";
import { useTable, useRowState } from "react-table";

const initialData = [
  { firstName: "John", lastName: "Smith", isEditable: false },
  { firstName: "Jane", lastName: "White", isEditable: false },
];

function useFormWithId<
  TFieldValues extends FieldValues = FieldValues,
  TContext extends object = object
>(options?: UseFormOptions<TFieldValues, TContext>) {
  const id = useMemo(() => Math.floor(Math.random() * 10000).toString(), []);
  return Object.assign(useForm<TFieldValues, TContext>(options), { id });
}

export function EditableTable() {
  const [isAddMode, setIsAddMode] = useState(false);

  const { register, handleSubmit, id: formId } = useFormWithId<{
    firstName: string;
    lastName: string;
  }>();

  function renderCell({ value, row, column }: any) {
    return row.original.isEditable ? (
      <input ref={register} name={column.id} form={formId} />
    ) : (
      value
    );
  }

  const defaultColumn = { Cell: renderCell };

  const columns = useMemo(
    () => [
      { Header: "First Name", accessor: "firstName" as const },
      { Header: "Last Name", accessor: "lastName" as const },
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ value, row, column }: any) => {
          return row.original.isEditable ? (
            <form
              id={formId}
              onSubmit={handleSubmit((newRecord) => {
                setSavedData((old) => [
                  ...old,
                  { ...newRecord, isEditable: false },
                ]);
                setIsAddMode(false);
              })}
            >
              <button type="submit">Submit Form {formId}</button>
            </form>
          ) : (
            ""
          );
        },
      },
    ],
    [formId, handleSubmit]
  );

  const [savedData, setSavedData] = useState(initialData);

  const data = useMemo(() => {
    if (isAddMode) {
      const addedRow = { firstName: " ", lastName: " ", isEditable: true };
      return [...savedData, addedRow];
    }
    return savedData;
  }, [isAddMode, savedData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetRowState: !isAddMode,
    },
    useRowState
  );

  return (
    <div>
      <button
        onClick={() => {
          setSavedData(initialData);
        }}
      >
        Reset
      </button>
      <table {...getTableProps()}>
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
      <button type="button" onClick={() => setIsAddMode((old) => !old)}>
        Toggle Add Mode
      </button>
    </div>
  );
}
