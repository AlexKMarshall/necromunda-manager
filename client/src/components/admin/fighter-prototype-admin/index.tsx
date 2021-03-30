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
        }) => ({ name, cost, factionName, fighterClassName, ...fighterStats })
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
      { Header: "WS", accessor: "weaponSkill" as const },
      { Header: "BS", accessor: "ballisticSkill" as const },
      { Header: "S", accessor: "strength" as const },
      { Header: "T", accessor: "toughness" as const },
      { Header: "W", accessor: "wounds" as const },
      { Header: "I", accessor: "initiative" as const },
      { Header: "A", accessor: "attacks" as const },
      { Header: "Ld", accessor: "leadership" as const },
      { Header: "Cl", accessor: "cool" as const },
      { Header: "Wil", accessor: "will" as const },
      { Header: "Int", accessor: "intelligence" as const },
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
        <FormControl
          name="name"
          errors={errors}
          label="Name:"
          register={register}
          renderControl={(props) => <input type="text" {...props} />}
        />
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
          <ErrorMessage
            errors={errors}
            name="cost"
            render={({ message }) => <span role="alert">{message}</span>}
          />
          {/* {errors.cost ? <span role="alert">{errors.cost.message}</span> : null} */}
        </div>
        <FormControl
          name="factionId"
          errors={errors}
          label="Faction:"
          register={register}
          renderControl={(props) => (
            <select {...props}>
              {factions.map((faction) => (
                <option key={faction.id} value={faction.id}>
                  {faction.name}
                </option>
              ))}
            </select>
          )}
        />
        <FormControl
          name="fighterClassId"
          errors={errors}
          label="Fighter Class:"
          register={register}
          renderControl={(props) => (
            <select {...props}>
              {factions.map((faction) => (
                <option key={faction.id} value={faction.id}>
                  {faction.name}
                </option>
              ))}
            </select>
          )}
        />
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
        <div css={stackSmall}>
          <label htmlFor="weaponSkill">Weapon Skill:</label>
          <Controller
            name="fighterStats.weaponSkill"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="weaponSkill"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.weaponSkill ? (
            <span role="alert">{errors.fighterStats.weaponSkill.message}</span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="ballisticSkill">Ballistic Skill:</label>
          <Controller
            name="fighterStats.ballisticSkill"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="ballisticSkill"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.ballisticSkill ? (
            <span role="alert">
              {errors.fighterStats.ballisticSkill.message}
            </span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="strength">Strength:</label>
          <Controller
            name="fighterStats.strength"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="strength"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.strength ? (
            <span role="alert">{errors.fighterStats.strength.message}</span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="toughness">Toughness:</label>
          <Controller
            name="fighterStats.toughness"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="toughness"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.toughness ? (
            <span role="alert">{errors.fighterStats.toughness.message}</span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="wounds">Wounds:</label>
          <Controller
            name="fighterStats.wounds"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="wounds"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.wounds ? (
            <span role="alert">{errors.fighterStats.wounds.message}</span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="initiative">Initiative:</label>
          <Controller
            name="fighterStats.initiative"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="initiative"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.initiative ? (
            <span role="alert">{errors.fighterStats.initiative.message}</span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="attacks">Attacks:</label>
          <Controller
            name="fighterStats.attacks"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="attacks"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.attacks ? (
            <span role="alert">{errors.fighterStats.attacks.message}</span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="leadership">Leadership:</label>
          <Controller
            name="fighterStats.leadership"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="leadership"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.leadership ? (
            <span role="alert">{errors.fighterStats.leadership.message}</span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="cool">Cool:</label>
          <Controller
            name="fighterStats.cool"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="cool"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.cool ? (
            <span role="alert">{errors.fighterStats.cool.message}</span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="will">Will:</label>
          <Controller
            name="fighterStats.will"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="will"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.will ? (
            <span role="alert">{errors.fighterStats.will.message}</span>
          ) : null}
        </div>
        <div css={stackSmall}>
          <label htmlFor="intelligence">Intelligence:</label>
          <Controller
            name="fighterStats.intelligence"
            control={control}
            render={({ value, onChange }) => (
              <input
                type="number"
                id="intelligence"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.fighterStats?.intelligence ? (
            <span role="alert">{errors.fighterStats.intelligence.message}</span>
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

type FormControlProps<TFieldValues extends FieldValues = FieldValues> = Pick<
  UseFormMethods<TFieldValues>,
  "register" | "errors"
> & {
  name: FieldName<TFieldValues>;
  label: string;
  renderControl: (props: RenderControlProps) => JSX.Element;
};

type RenderControlProps = {
  ref: FormControlProps["register"];
  id: string;
  name: FormControlProps["name"];
};

function FormControl({
  register,
  errors,
  name,
  label,
  renderControl,
}: FormControlProps) {
  const id = generateId();
  return (
    <div css={stackSmall}>
      <label htmlFor={id}>{label}</label>
      {renderControl({ ref: register, name, id })}
      {errors[name] ? <span role="alert">{errors[name].message}</span> : null}
    </div>
  );
}
