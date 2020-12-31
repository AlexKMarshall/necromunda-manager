import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Stack,
  Spinner,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Form, FormControl } from "./Form";
import {
  useCreateFaction,
  useDeleteFaction,
  useReadFactions,
} from "../hooks/factions";
import { createFactionDtoSchema, Faction } from "../schemas/faction.schema";

export default function Factions() {
  const { isLoading, isError, error, factions } = useReadFactions();

  return (
    <Box p={4}>
      <Stack>
        <Heading>Factions</Heading>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <pre>{JSON.stringify(error, null, 2)}</pre>
        ) : (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Faction Name</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {factions
                ? factions.map((faction) => (
                    <FactionRow key={faction.id} faction={faction} />
                  ))
                : null}
            </Tbody>
          </Table>
        )}
      </Stack>
      <CreateFaction />
    </Box>
  );
}

function FactionRow({ faction }: { faction: Faction }) {
  const { isLoading: isDeleteLoading, deleteFaction } = useDeleteFaction();
  const isPendingSave = faction.id.startsWith("TEMP");

  const handleDelete = () => deleteFaction(faction.id);

  return (
    <Tr>
      <Td>{faction.name}</Td>
      <Td>
        {isPendingSave ? (
          <Spinner />
        ) : (
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleteLoading}
          >
            Delete
          </Button>
        )}
      </Td>
    </Tr>
  );
}

interface FactionFormData {
  name: string;
}

function CreateFaction() {
  const { isLoading, postFaction } = useCreateFaction();
  const { register, handleSubmit, reset, errors } = useForm<FactionFormData>({
    resolver: zodResolver(createFactionDtoSchema),
  });

  const onSubmit = async (formData: FactionFormData) => {
    await postFaction(formData);
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} heading="Create New Faction">
      <FormControl
        id="faction-name"
        isRequired
        isInvalid={Boolean(errors.name)}
      >
        <FormLabel>Faction Name</FormLabel>
        <Input name="name" ref={register({ required: true })} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Submit"}
      </Button>
    </Form>
  );
}
