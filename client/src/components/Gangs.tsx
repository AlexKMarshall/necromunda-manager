import { useForm } from "react-hook-form";
import { useRouteMatch, Link } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
import { createGangDtoSchema } from "../schemas/gang.schema";

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
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Faction</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {gangs.map((gang: any) => (
                <GangRow gang={gang} key={gang.id} />
              ))}
            </Tbody>
          </Table>
        )}
        <CreateGang />
      </Stack>
    </Box>
  );
}

function GangRow({ gang }: { gang: any }) {
  const { isLoading: isDeleteLoading, deleteGang } = useDeleteGang();
  const isPendingSave = gang.id.startsWith("TEMP");
  let { url } = useRouteMatch();

  const handleDelete = () => deleteGang(gang.id);

  return (
    <Tr>
      <Td>
        <Link to={`${url}/${gang.id}`}>{gang.name}</Link>
      </Td>
      <Td>{gang.faction.name}</Td>
      <Td>
        {isPendingSave ? (
          <Spinner />
        ) : (
          <Button
            type="button"
            onClick={handleDelete}
            isDisabled={isDeleteLoading}
          >
            Delete
          </Button>
        )}
      </Td>
    </Tr>
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
