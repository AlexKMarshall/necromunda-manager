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
import { HiOutlineTrash } from "react-icons/hi";
import { Form, FormControl } from "./Form";
import {
  useCreateFaction,
  useDeleteFaction,
  useReadFactions,
} from "../hooks/factions";
import { createFactionDtoSchema, Faction } from "../schemas/faction.schema";
import { useMemo } from "react";
import AdminTable from "./AdminTable";
import { useAsyncButton } from "../hooks/async";

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
          <FactionsTable factions={factions} />
        )}
      </Stack>
      <CreateFaction />
    </Box>
  );
}

interface FactionsTableProps {
  factions: Faction[];
}

function FactionsTable({ factions }: FactionsTableProps) {
  const columns = useMemo(
    () => [
      {
        Header: "Faction Name",
        accessor: "name" as const,
      },
    ],
    []
  );

  return (
    <AdminTable
      columns={columns}
      data={factions}
      deleteButton={DeleteFaction}
    />
  );
}

function DeleteFaction({ id }: { id: string }) {
  const { deleteFaction } = useDeleteFaction();
  const handleDelete = () => deleteFaction(id);
  const { isLoading, getAsyncButtonProps } = useAsyncButton();

  return (
    <Button {...getAsyncButtonProps({ onClick: handleDelete })}>
      {isLoading ? <Spinner /> : <HiOutlineTrash />}
    </Button>
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
    if (isLoading) return;
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
