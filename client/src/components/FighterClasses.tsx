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
  useCreateFighterClass,
  useDeleteFighterClass,
  useReadFighterClasses,
} from "../hooks/fighter-classes";
import {
  createFighterClassDtoSchema,
  FighterClass,
} from "../schemas/fighter-class.schema";

export default function FighterClasses() {
  const { isLoading, isError, error, fighterClasses } = useReadFighterClasses();

  return (
    <Box p={4}>
      <Stack>
        <Heading>Fighter Classes</Heading>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <pre>{JSON.stringify(error, null, 2)}</pre>
        ) : (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Fighter Class Name</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {fighterClasses.map((fighterClass) => (
                <FighterClassRow
                  fighterClass={fighterClass}
                  key={fighterClass.id}
                />
              ))}
            </Tbody>
          </Table>
        )}
        <CreateFighterClass />
      </Stack>
    </Box>
  );
}

interface FighterClassRowProps {
  fighterClass: FighterClass;
}

function FighterClassRow({ fighterClass }: FighterClassRowProps) {
  const {
    isLoading: isDeleteLoading,
    deleteFighterClass,
  } = useDeleteFighterClass();
  const isPendingSave = fighterClass.id.startsWith("TEMP");

  const handleDelete = () => deleteFighterClass(fighterClass.id);
  return (
    <Tr>
      <Td>{fighterClass.name}</Td>
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

interface FighterClassFormData {
  name: string;
}

function CreateFighterClass() {
  const { isLoading, postFighterClass } = useCreateFighterClass();
  const {
    register,
    handleSubmit,
    reset,
    errors,
  } = useForm<FighterClassFormData>({
    resolver: zodResolver(createFighterClassDtoSchema),
  });

  const onSubmit = async (formData: FighterClassFormData) => {
    await postFighterClass(formData);
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} heading="Create New Fighter Class">
      <FormControl id="fighter-class-name" isRequired>
        <FormLabel>Fighter Class Name</FormLabel>
        <Input name="name" ref={register({ required: true })} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Submit"}
      </Button>
    </Form>
  );
}
