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
import {
  useCreateFighterClass,
  useReadFighterClasses,
} from "../hooks/fighter-classes";

export default function FighterClasses() {
  const { isLoading, isError, error, fighterClasses } = useReadFighterClasses();

  return (
    <Box p={4}>
      <Stack>
        <Heading>Fighter Classes</Heading>
        {isLoading ? (
          <div>"Loading..."</div>
        ) : isError ? (
          <pre>{JSON.stringify(error, null, 2)}</pre>
        ) : (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Fighter Class Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {fighterClasses.map((fighterClass: any) => (
                <Tr key={fighterClass.id}>
                  <Td>{fighterClass.name}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        <CreateFighterClass />
      </Stack>
    </Box>
  );
}

interface FighterClassFormData {
  name: string;
}

function CreateFighterClass() {
  const { isLoading, postFighterClass } = useCreateFighterClass();
  const { register, handleSubmit, reset } = useForm<FighterClassFormData>();

  const onSubmit = async (formData: FighterClassFormData) => {
    await postFighterClass(formData);
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} heading="Create New Fighter Class">
      <FormControl id="fighter-class-name" isRequired>
        <FormLabel>Fighter Class Name</FormLabel>
        <Input name="name" ref={register({ required: true })} />
      </FormControl>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Submit"}
      </Button>
    </Form>
  );
}
