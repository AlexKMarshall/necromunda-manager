/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { useTable } from "react-table";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createFighterPrototypeDtoSchema } from "../../../schemas/fighter-prototype.schema";
import {
  useReadFighterPrototypes,
  useCreateFighterPrototype,
} from "../../../hooks/fighter-prototypes";
import { useReadFactions } from "../../../hooks/factions";
import { box, stack, stackSmall, cluster } from "../../../styles";
import { useReadFighterClasses } from "../../../hooks/fighter-classes";

const addFighterPrototypeFormSchema = z.object({
  name: createFighterPrototypeDtoSchema.shape.name.nonempty({
    message: "Required",
  }),
  cost: createFighterPrototypeDtoSchema.shape.cost.nonnegative({
    message: "Must be a positive number",
  }),
  factionId: createFighterPrototypeDtoSchema.shape.factionId.nonempty({
    message: "Required",
  }),
  fighterClassId: createFighterPrototypeDtoSchema.shape.fighterClassId.nonempty(
    { message: "Required" }
  ),
  fighterStats: createFighterPrototypeDtoSchema.shape.fighterStats,
});
type AddFighterClassForm = z.infer<typeof addFighterPrototypeFormSchema>;

interface FighterPrototypeAdminProps {}
export function FighterPrototypeAdmin(props: FighterPrototypeAdminProps) {
  const {
    isLoading,
    isError,
    error,
    fighterPrototypes,
  } = useReadFighterPrototypes();
  const { isLoading: areFactionsLoading, factions } = useReadFactions();
  const {
    isLoading: areFighterClassesLoading,
    fighterClasses,
  } = useReadFighterClasses();
  const { register, handleSubmit, errors, reset, control } = useForm<
    AddFighterClassForm
  >({
    defaultValues: {
      name: "",
      cost: 0,
      fighterClassId: "",
      factionId: "",
      fighterStats: {
        movement: 0,
      },
    },
    resolver: zodResolver(addFighterPrototypeFormSchema),
  });
  const { postFighterPrototype } = useCreateFighterPrototype();

  async function onSubmit(data: AddFighterClassForm) {
    await postFighterPrototype(data);
    reset();
  }

  const data = useMemo(
    () =>
      fighterPrototypes.map(
        ({
          name,
          cost,
          faction: { name: factionName },
          fighterClass: { name: fighterClassName },
          fighterStats: { movement },
        }) => ({ name, cost, factionName, fighterClassName, movement })
      ),
    [fighterPrototypes]
  );

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name" as const },
      { Header: "Cost", accessor: "cost" as const },
      { Header: "Faction", accessor: "factionName" as const },
      { Header: "Fighter Class", accessor: "fighterClassName" as const },
      { Header: "M", accessor: "movement" as const },
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
    <div css={stack}>
      <h2>Fighter Prototypes</h2>
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
        <div css={stackSmall}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" ref={register} />
          {errors.name ? <span role="alert">{errors.name.message}</span> : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="cost">Cost:</label>
          <Controller
            name="cost"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="cost"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.cost ? <span role="alert">{errors.cost.message}</span> : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="factionId">Faction:</label>
          <select id="factionId" name="factionId" ref={register}>
            {factions.map((faction) => (
              <option key={faction.id} value={faction.id}>
                {faction.name}
              </option>
            ))}
          </select>
          {errors.factionId ? (
            <span role="alert">{errors.factionId.message}</span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="fighterClassId">Fighter Class:</label>
          <select id="fighterClassId" name="fighterClassId" ref={register}>
            {fighterClasses.map((fc) => (
              <option key={fc.id} value={fc.id}>
                {fc.name}
              </option>
            ))}
          </select>
          {errors.fighterClassId ? (
            <span role="alert">{errors.fighterClassId.message}</span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="movement">Movement:</label>
          <Controller
            name="fighterStats.movement"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="movement"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.movement ? (
            <span role="alert">{errors.fighterStats.movement.message}</span>
          ) : null}
        </div>

        <div css={cluster}>
          <div>
            <button type="submit">Add Fighter Class</button>
          </div>
        </div>
      </form>
    </div>
  );
}
