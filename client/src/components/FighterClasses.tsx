import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
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
import { useMemo } from "react";
import AdminTable from "./AdminTable";

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
          <FighterClassesTable fighterClasses={fighterClasses} />
        )}
        <CreateFighterClass />
      </Stack>
    </Box>
  );
}

interface FighterClassesTableProps {
  fighterClasses: FighterClass[];
}

function FighterClassesTable({ fighterClasses }: FighterClassesTableProps) {
  const columns = useMemo(
    () => [
      {
        Header: "Fighter Class Name",
        accessor: "name" as const,
      },
    ],
    []
  );

  return (
    <AdminTable
      columns={columns}
      data={fighterClasses}
      deleteButton={DeleteFighterClass}
    />
  );
}

function DeleteFighterClass({ id }: { id: string }) {
  const {
    isLoading: isDeleteLoading,
    deleteFighterClass,
  } = useDeleteFighterClass();
  const handleDelete = () => deleteFighterClass(id);

  return (
    <Button onClick={handleDelete} disabled={isDeleteLoading}>
      Delete
    </Button>
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
