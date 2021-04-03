/** @jsxImportSource @emotion/react */
import React, { useMemo } from "react";
import { CellValue, Row, useTable } from "react-table";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateWeaponDto,
  createWeaponDtoSchema,
  Weapon,
  weaponTypes,
} from "../../../schemas";
import {
  useReadWeapons,
  useCreateWeapon,
  useDeleteWeapon,
} from "../../../hooks/weapons";
import { useReadTraits } from "../../../hooks/traits";
import { box, stack, cluster, stackSmall } from "../../../styles";
import { StandardFormControl } from "../../form";
import { ArrayElement } from "../../../utils/types";
import { formatTitleCase } from "../../../utils";

type RenderControlProps = Parameters<
  React.ComponentPropsWithoutRef<
    typeof StandardFormControl
  >["renderControlElement"]
>[0];

interface WeaponAdminProps {}
export function WeaponAdmin(props: WeaponAdminProps) {
  const {
    isLoading: isLoadingWeapons,
    isError: isErrorWeapons,
    error: errorWeapons,
    weapons,
  } = useReadWeapons();
  const {
    isLoading: isLoadingTraits,
    isError: isErrorTraits,
    error: errorTraits,
    traits,
  } = useReadTraits();
  const isLoading = [isLoadingWeapons, isLoadingTraits].some((l) => l);
  const isError = [isErrorWeapons, isErrorTraits].some((e) => e);
  const error = [errorWeapons, errorTraits].filter((e) => Boolean(e));
  const { register, handleSubmit, errors, reset, control } = useForm<
    CreateWeaponDto
  >({
    defaultValues: {
      name: "",
      cost: 0,
    },
    resolver: zodResolver(createWeaponDtoSchema),
  });
  const { fields, append } = useFieldArray({ control, name: "traits" });
  const { postWeapon } = useCreateWeapon();

  async function onSubmit(data: CreateWeaponDto) {
    await postWeapon(data);
    reset();
  }

  const data = useMemo(
    () =>
      weapons.map(
        ({
          id,
          name,
          cost,
          stats: {
            range: { short: shortRange, long: longRange },
            accuracy: { short: shortAcc, long: longAcc },
            strength,
            armourPenetration,
            damage,
            ammo,
          },
          traits,
          weaponType,
          loading,
        }) => ({
          id,
          name,
          cost,
          shortRange,
          longRange,
          shortAcc,
          longAcc,
          strength,
          armourPenetration,
          damage,
          ammo,
          traits,
          weaponType,
          loading,
        })
      ),
    [weapons]
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
        Header: "Short Range",
        accessor: "shortRange" as const,
      },
      {
        Header: "Long Range",
        accessor: "longRange" as const,
      },
      {
        Header: "Short Acc",
        accessor: "shortAcc" as const,
      },
      {
        Header: "Long Acc",
        accessor: "longAcc" as const,
      },
      {
        Header: "S",
        accessor: "strength" as const,
      },
      {
        Header: "AP",
        accessor: "armourPenetration" as const,
      },
      {
        Header: "Damage",
        accessor: "damage" as const,
      },
      {
        Header: "Ammo",
        accessor: "ammo" as const,
      },
      {
        Header: "Weapon Type",
        accessor: "weaponType" as const,
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
            <DeleteWeaponButton
              id={value}
              label={`Delete Weapon ${original.name}`}
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
      <h2>Weapons</h2>
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
              label="Weapon Name:"
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
              name="stats.range.short"
              label="Short Range:"
              renderControlElement={renderNumberControl}
              error={errors.stats?.range?.short}
            />
            <StandardFormControl
              name="stats.range.long"
              label="Long Range:"
              renderControlElement={renderNumberControl}
              error={errors.stats?.range?.long}
            />
            <StandardFormControl
              name="stats.accuracy.long"
              label="Short Accuracy:"
              renderControlElement={renderNumberControl}
              error={errors.stats?.accuracy?.short}
            />
            <StandardFormControl
              name="stats.accuracy.long"
              label="Long Accuracy:"
              renderControlElement={renderNumberControl}
              error={errors.stats?.accuracy?.long}
            />
            <StandardFormControl
              name="stats.strength"
              label="Strength:"
              renderControlElement={renderNumberControl}
              error={errors.stats?.strength}
            />
            <StandardFormControl
              name="stats.armourPenetration"
              label="Armour Penetration:"
              renderControlElement={renderNumberControl}
              error={errors.stats?.armourPenetration}
            />
            <StandardFormControl
              name="stats.damage"
              label="Damage:"
              renderControlElement={renderNumberControl}
              error={errors.stats?.damage}
            />
            <StandardFormControl
              name="stats.ammo"
              label="Ammo:"
              renderControlElement={renderNumberControl}
              error={errors.stats?.ammo}
            />
            <StandardFormControl
              name="weaponType"
              label="Weapon Type:"
              renderControlElement={(props) => (
                <select {...props} ref={register}>
                  {weaponTypes.map((wt) => (
                    <option key={wt} value={wt}>
                      {formatTitleCase(wt)}
                    </option>
                  ))}
                </select>
              )}
              error={errors.weaponType}
            />
            <div css={stackSmall}>
              <h3>Traits:</h3>
              <ul>
                {fields.map((item, index) => (
                  <li key={item.id}>
                    <div css={cluster}>
                      <div>
                        <div css={stackSmall}>
                          <label htmlFor={`traits[${index}].id`}>
                            Trait Name:
                          </label>
                          <select
                            id={`traits[${index}].id`}
                            name={`traits[${index}].id`}
                            ref={register()}
                            defaultValue=""
                          >
                            {traits.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div css={stackSmall}>
                          <label htmlFor={`traits[${index}].modifier`}>
                            Modifier:
                          </label>
                          <input
                            id={`traits[${index}].modifier`}
                            name={`traits[${index}].modifier`}
                            ref={register()}
                            defaultValue=""
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div css={cluster}>
                <div>
                  <button type="button" onClick={() => append({ id: "" })}>
                    Add trait
                  </button>
                </div>
              </div>
            </div>
            <div css={cluster}>
              <div>
                <button type="submit">Add Weapon</button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

interface DeleteWeaponButtonProps {
  id: Weapon["id"];
  label: string;
}
function DeleteWeaponButton({ id, label }: DeleteWeaponButtonProps) {
  const { deleteWeapon } = useDeleteWeapon(id);
  return (
    <button onClick={() => deleteWeapon()} aria-label={label}>
      Delete
    </button>
  );
}
