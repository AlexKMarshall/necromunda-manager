/** @jsxImportSource @emotion/react */
import React, { useMemo } from "react";
import { useTable } from "react-table";
import {
  Controller,
  useForm,
  FieldError,
  UseFormMethods,
  FieldName,
  FieldValues,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
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
import { render } from "@testing-library/react";

const uniqueIdFactory = () => {
  let num = 0;
  return (prefix = "") => {
    num += 1;
    return `${prefix}_${num}`;
  };
};

const generateId = uniqueIdFactory();

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

  function renderNumericInput({
    name,
    label,
  }: {
    name: string;
    label: string;
  }) {
    const id = generateId();
    return (
      <div css={stackSmall}>
        <label htmlFor={id}>{label}</label>
        <Controller
          name={name}
          control={control}
          render={({ value, onChange }) => (
            <input
              type="number"
              id={id}
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value, 10))}
            />
          )}
        />
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => <span role="alert">{message}</span>}
        />
      </div>
    );
  }

  function renderTextInput({ name, label }: { name: string; label: string }) {
    const id = generateId();
    return (
      <div css={stackSmall}>
        <label htmlFor={id}>{label}</label>
        <input type="text" name={name} id={id} ref={register} />
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => <span role="alert">{message}</span>}
        />
      </div>
    );
  }

  function renderSelectInput({
    name,
    label,
    options,
  }: {
    name: string;
    label: string;
    options: React.ReactNode;
  }) {
    const id = generateId();
    return (
      <div css={stackSmall}>
        <label htmlFor={id}>{label}</label>
        <select name={name} id={id} ref={register}>
          {options}
        </select>
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => <span role="alert">{message}</span>}
        />
      </div>
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
        {renderTextInput({
          name: "name",
          label: "Name:",
        })}
        {renderNumericInput({
          name: "cost",
          label: "Cost:",
        })}
        {renderSelectInput({
          name: "factionId",
          label: "Faction:",
          options: factions.map((faction) => (
            <option key={faction.id} value={faction.id}>
              {faction.name}
            </option>
          )),
        })}
        {renderSelectInput({
          name: "fighterClassId",
          label: "Fighter Class:",
          options: factions.map((faction) => (
            <option key={faction.id} value={faction.id}>
              {faction.name}
            </option>
          )),
        })}
        {renderNumericInput({
          name: "fighterStats.movement",
          label: "Movement:",
        })}
        {renderNumericInput({
          name: "fighterStats.weaponSkill",
          label: "Weapon Skill:",
        })}
        {renderNumericInput({
          name: "fighterStats.ballisticSkill",
          label: "Ballistic Skill:",
        })}
        {renderNumericInput({
          name: "fighterStats.strength",
          label: "Strength:",
        })}
        {renderNumericInput({
          name: "fighterStats.toughness",
          label: "Toughness:",
        })}
        {renderNumericInput({
          name: "fighterStats.wounds",
          label: "Wounds:",
        })}
        {renderNumericInput({
          name: "fighterStats.initiative",
          label: "Initiative:",
        })}
        {renderNumericInput({
          name: "fighterStats.attacks",
          label: "Attacks:",
        })}
        {renderNumericInput({
          name: "fighterStats.leadership",
          label: "Leadership:",
        })}
        {renderNumericInput({
          name: "fighterStats.cool",
          label: "Cool:",
        })}
        {renderNumericInput({
          name: "fighterStats.will",
          label: "Will:",
        })}
        {renderNumericInput({
          name: "fighterStats.intelligence",
          label: "Intelligence:",
        })}
        <div css={cluster}>
          <div>
            <button type="submit">Add Fighter Class</button>
          </div>
        </div>
      </form>
    </div>
  );
}
