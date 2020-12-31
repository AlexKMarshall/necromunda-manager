import { useForm } from "react-hook-form";
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
} from "@chakra-ui/react";
import { Form, FormControl } from "./Form";
import { useCreateFaction, useReadFactions } from "../hooks/factions";

export default function Factions() {
  const { isLoading, isError, error, factions } = useReadFactions();

  return (
    <Box p={4}>
      <Stack>
        <Heading>Factions</Heading>
        {isLoading ? (
          <div>"Loading..."</div>
        ) : isError ? (
          <pre>{JSON.stringify(error, null, 2)}</pre>
        ) : (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Faction Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {factions.map((faction: any) => (
                <Tr key={faction.id}>
                  <Td>{faction.name}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Stack>
      <CreateFaction />
    </Box>
  );
}

interface FactionFormData {
  name: string;
}

function CreateFaction() {
  const { isLoading, postFaction } = useCreateFaction();
  const { register, handleSubmit, reset } = useForm<FactionFormData>();

  const onSubmit = async (formData: FactionFormData) => {
    await postFaction(formData);
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} heading="Create New Faction">
      <FormControl id="faction-name" isRequired>
        <FormLabel>Faction Name</FormLabel>
        <Input name="name" ref={register({ required: true })} />
      </FormControl>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Submit"}
      </Button>
    </Form>
  );
}
