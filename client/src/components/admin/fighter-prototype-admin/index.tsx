/** @jsxImportSource @emotion/react */
import React, { useMemo } from "react";
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
import { box, stack, cluster } from "../../../styles";
import { useReadFighterClasses } from "../../../hooks/fighter-classes";
import { StandardFormControl } from "../../form";

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

type RenderControlProps = Parameters<
  React.ComponentPropsWithoutRef<
    typeof StandardFormControl
  >["renderControlElement"]
>[0];

interface FighterPrototypeAdminProps {}
export function FighterPrototypeAdmin(props: FighterPrototypeAdminProps) {
  const {
    isLoading,
    isError,
    error,
    fighterPrototypes,
  } = useReadFighterPrototypes();
  const { factions } = useReadFactions();
  const { fighterClasses } = useReadFighterClasses();
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
          fighterStats,
        }) => ({
          name,
          cost,
          factionName,
          fighterClassName,
          ...fighterStats,
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

  function renderNumberControl({ name, ...props }: RenderControlProps) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ value, onChange }) => (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            {...props}
          />
        )}
      />
    );
  }

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
        <StandardFormControl
          name="name"
          label="Name:"
          renderControlElement={(props) => (
            <input {...props} type="text" ref={register} />
          )}
          error={errors.name}
        />
        <StandardFormControl
          name="cost"
          label="Cost:"
          renderControlElement={renderNumberControl}
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
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.movement}
        />
        <StandardFormControl
          name="fighterStats.weaponSkill"
          label="Weapon Skill:"
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.weaponSkill}
        />
        <StandardFormControl
          name="fighterStats.ballisticSkill"
          label="Ballistic Skill:"
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.ballisticSkill}
        />
        <StandardFormControl
          name="fighterStats.strength"
          label="Strength:"
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.strength}
        />
        <StandardFormControl
          name="fighterStats.toughness"
          label="Toughness:"
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.toughness}
        />
        <StandardFormControl
          name="fighterStats.wounds"
          label="Initiative:"
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.wounds}
        />
        <StandardFormControl
          name="fighterStats.initiative"
          label="Initiative:"
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.initiative}
        />
        <StandardFormControl
          name="fighterStats.attacks"
          label="Attacks:"
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.attacks}
        />
        <StandardFormControl
          name="fighterStats.leadership"
          label="Leadership:"
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.leadership}
        />
        <StandardFormControl
          name="fighterStats.cool"
          label="Cool:"
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.cool}
        />
        <StandardFormControl
          name="fighterStats.will"
          label="Will:"
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.will}
        />
        <StandardFormControl
          name="fighterStats.intelligence"
          label="Intelligence:"
          renderControlElement={renderNumberControl}
          error={errors.fighterStats?.intelligence}
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
