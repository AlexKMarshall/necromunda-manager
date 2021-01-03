import { useForm } from "react-hook-form";
import { Row, CellValue } from "react-table";
import { useRouteMatch, Link } from "react-router-dom";
import {
  Heading,
  Box,
  FormLabel,
  Input,
  Button,
  Select,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { Form, FormControl } from "./Form";

import { useReadFactions } from "../hooks/factions";
import { useCreateGang, useDeleteGang, useReadGangs } from "../hooks/gangs";
import { createGangDtoSchema, Gang } from "../schemas/gang.schema";
import { useMemo } from "react";
import AdminTable from "./AdminTable";

export default function Gangs() {
  const { isLoading, isError, error, gangs } = useReadGangs();

  return (
    <Box p={4}>
      <Stack>
        <Heading>Gangs</Heading>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <pre>{JSON.stringify(error, null, 2)}</pre>
        ) : (
          <GangsTable gangs={gangs} />
        )}
        <CreateGang />
      </Stack>
    </Box>
  );
}

interface GangsTableProps {
  gangs: Gang[];
}

function GangsTable({ gangs }: GangsTableProps) {
  let { url } = useRouteMatch();
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name" as const,
        Cell: ({
          row: { original },
          value,
        }: {
          row: Row<Gang>;
          value: CellValue;
        }) => <Link to={`${url}/${original.id}`}>{value}</Link>,
      },
      {
        Header: "Faction",
        accessor: "faction.name" as const,
      },
    ],
    [url]
  );

  return (
    <AdminTable columns={columns} data={gangs} deleteButton={DeleteGang} />
  );
}

function DeleteGang({ id }: { id: string }) {
  const { isLoading: isDeleteLoading, deleteGang } = useDeleteGang();
  const handleDelete = () => deleteGang(id);

  return (
    <Button onClick={handleDelete} disabled={isDeleteLoading}>
      Delete
    </Button>
  );
}

interface GangFormData {
  name: string;
  factionId: string;
}

function CreateGang() {
  const { isLoading, postGang } = useCreateGang();
  const { isLoading: isFactionLoading, factions } = useReadFactions();
  const { register, handleSubmit, reset } = useForm<GangFormData>();

  const convertFormToDto = ({ name, factionId }: GangFormData) => {
    const maybeGang = {
      name,
      faction: factions.find((f) => f.id === factionId),
    };
    return createGangDtoSchema.parse(maybeGang);
  };

  const onSubmit = async (formData: GangFormData) => {
    const createGangDto = convertFormToDto(formData);
    await postGang(createGangDto);
    reset();
  };

  if (isFactionLoading) return <div>Loading...</div>;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} heading="Create New Gang">
      <FormControl id="gang-name" isRequired>
        <FormLabel>Gang Name</FormLabel>
        <Input name="name" ref={register({ required: true })} />
      </FormControl>
      <FormControl id="faction" isRequired>
        <FormLabel>Select Faction:</FormLabel>
        <Select
          name="factionId"
          ref={register({ required: true })}
          placeholder="Select option"
        >
          {factions.map((faction: any) => (
            <option key={faction.id} value={faction.id}>
              {faction.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Submit"}
      </Button>
    </Form>
  );
}
