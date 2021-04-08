/** @jsxImportSource @emotion/react */
import React, { useMemo } from "react";
import { CellValue, Row, useTable } from "react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createFighterPrototypeDtoSchema,
  FighterPrototype,
} from "../../../schemas/fighter-prototype.schema";
import {
  useReadFighterPrototypes,
  useCreateFighterPrototype,
  useDeleteFighterPrototype,
} from "../../../hooks/fighter-prototypes";
import { useReadFactions } from "../../../hooks/factions";
import { box, stack, cluster } from "../../../styles";
import { useReadFighterClasses } from "../../../hooks/fighter-classes";
import { StandardFormControl } from "../../form";
import { ArrayElement } from "../../../utils/types";

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
    isLoading: isLoadingFPs,
    isError: isErrorFPs,
    error: errorFPs,
    fighterPrototypes,
  } = useReadFighterPrototypes();
  const {
    isLoading: isLoadingFactions,
    isError: isErrorFactions,
    error: errorFactions,
    factions,
  } = useReadFactions();
  const {
    isLoading: isLoadingFCs,
    isError: isErrorFCs,
    error: errorFCs,
    fighterClasses,
  } = useReadFighterClasses();
  const isLoading = [isLoadingFPs, isLoadingFactions, isLoadingFCs].some(
    (l) => l
  );
  const isError = [isErrorFPs, isErrorFactions, isErrorFCs].some((e) => e);
  const error = [errorFPs, errorFactions, errorFCs].filter((e) => Boolean(e));
  const { register, handleSubmit, errors, reset } = useForm<
    AddFighterClassForm
  >({
    defaultValues: {
      name: "",
      cost: 0,
      fighterClassId: "",
      factionId: "",
      fighterStats: {
        movement: 0,
        weaponSkill: 0,
        ballisticSkill: 0,
        strength: 0,
        toughness: 0,
        wounds: 0,
        initiative: 0,
        attacks: 0,
        leadership: 0,
        cool: 0,
        will: 0,
        intelligence: 0,
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
          id,
          name,
          cost,
          faction: { name: factionName },
          fighterClass: { name: fighterClassName },
          fighterStats,
          loading,
        }) => ({
          id,
          name,
          cost,
          factionName,
          fighterClassName,
          ...fighterStats,
          loading,
        })
      ),
    [fighterPrototypes]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name" as const,
      },
      {
        Header: "Cost",
        accessor: "cost" as const,
      },
      {
        Header: "Faction",
        accessor: "factionName" as const,
      },
      {
        Header: "Fighter Class",
        accessor: "fighterClassName" as const,
      },
      {
        Header: "M",
        accessor: "movement" as const,
      },
      {
        Header: "WS",
        accessor: "weaponSkill" as const,
      },
      {
        Header: "BS",
        accessor: "ballisticSkill" as const,
      },
      {
        Header: "S",
        accessor: "strength" as const,
      },
      {
        Header: "T",
        accessor: "toughness" as const,
      },
      {
        Header: "W",
        accessor: "wounds" as const,
      },
      {
        Header: "I",
        accessor: "initiative" as const,
      },
      {
        Header: "A",
        accessor: "attacks" as const,
      },
      {
        Header: "Ld",
        accessor: "leadership" as const,
      },
      {
        Header: "Cl",
        accessor: "cool" as const,
      },
      {
        Header: "Wil",
        accessor: "will" as const,
      },
      {
        Header: "Int",
        accessor: "intelligence" as const,
      },
      {
        Header: "Actions",
        accessor: "id" as const,
        Cell: ({
          row: { original },
          value,
        }: {
          row: Row<ArrayElement<typeof data>>;
          value: CellValue;
        }) =>
          original.loading ? (
            <span aria-label="loading">Spinner</span>
          ) : (
            <DeleteFighterPrototypeButton
              id={value}
              label={`Delete Fighter Prototype ${original.name}`}
            />
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
  } = useTable({
    columns,
    data,
  });

  return (
    <div css={stack}>
      <h2>Fighter Prototypes</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <pre>{JSON.stringify(error)}</pre>
      ) : (
        <>
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
          <form onSubmit={handleSubmit(onSubmit)} css={stack}>
            <StandardFormControl
              name="name"
              label="Fighter Prototype Name:"
              renderControlElement={(props) => (
                <input {...props} type="text" ref={register} />
              )}
              error={errors.name}
            />
            <StandardFormControl
              name="cost"
              label="Cost:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.cost}
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
            <StandardFormControl
              name="fighterClassId"
              label="Fighter Class:"
              renderControlElement={(props) => (
                <select ref={register} {...props}>
                  {fighterClasses.map((faction) => (
                    <option key={faction.id} value={faction.id}>
                      {faction.name}
                    </option>
                  ))}
                </select>
              )}
              error={errors.factionId}
            />
            <StandardFormControl
              name="fighterStats.movement"
              label="Movement:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.movement}
            />
            <StandardFormControl
              name="fighterStats.weaponSkill"
              label="Weapon Skill:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.weaponSkill}
            />
            <StandardFormControl
              name="fighterStats.ballisticSkill"
              label="Ballistic Skill:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.ballisticSkill}
            />
            <StandardFormControl
              name="fighterStats.strength"
              label="Strength:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.strength}
            />
            <StandardFormControl
              name="fighterStats.toughness"
              label="Toughness:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.toughness}
            />
            <StandardFormControl
              name="fighterStats.wounds"
              label="Wounds:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.wounds}
            />
            <StandardFormControl
              name="fighterStats.initiative"
              label="Initiative:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.initiative}
            />
            <StandardFormControl
              name="fighterStats.attacks"
              label="Attacks:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.attacks}
            />
            <StandardFormControl
              name="fighterStats.leadership"
              label="Leadership:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.leadership}
            />
            <StandardFormControl
              name="fighterStats.cool"
              label="Cool:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.cool}
            />
            <StandardFormControl
              name="fighterStats.will"
              label="Will:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.will}
            />
            <StandardFormControl
              name="fighterStats.intelligence"
              label="Intelligence:"
              renderControlElement={(props) => (
                <input
                  {...props}
                  type="number"
                  ref={register({ valueAsNumber: true })}
                />
              )}
              error={errors.fighterStats?.intelligence}
            />
            <div css={cluster}>
              <div>
                <button type="submit">Add Fighter Prototype</button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

interface DeleteFighterPrototypeButtonProps {
  id: FighterPrototype["id"];
  label: string;
}
function DeleteFighterPrototypeButton({
  id,
  label,
}: DeleteFighterPrototypeButtonProps) {
  const { deleteFighterPrototype } = useDeleteFighterPrototype(id);
  return (
    <button onClick={() => deleteFighterPrototype()} aria-label={label}>
      Delete
    </button>
  );
}
