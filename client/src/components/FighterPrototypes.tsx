import { useForm } from "react-hook-form";
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
import { useReadFighterClasses } from "../hooks/fighter-classes";
import {
  useCreateFighterPrototype,
  useDeleteFighterPrototype,
  useReadFighterPrototypes,
} from "../hooks/fighter-prototypes";
import {
  createFighterPrototypeDtoSchema,
  FighterPrototype,
} from "../schemas/fighter-prototype.schema";
import { useMemo } from "react";
import AdminTable from "./AdminTable";

export default function FighterPrototypes() {
  const {
    isLoading,
    isError,
    error,
    fighterPrototypes,
  } = useReadFighterPrototypes();

  return (
    <Box p={4}>
      <Stack>
        <Heading>Fighter Prototypes</Heading>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <pre>{JSON.stringify(error, null, 2)}</pre>
        ) : (
          <FighterPrototypesTable fighterPrototypes={fighterPrototypes} />
        )}
        <CreateFighterPrototype />
      </Stack>
    </Box>
  );
}

interface FighterPrototypesTableProps {
  fighterPrototypes: FighterPrototype[];
}

function FighterPrototypesTable({
  fighterPrototypes,
}: FighterPrototypesTableProps) {
  const columns = useMemo(
    () => [
      {
        Header: "Faction",
        accessor: "faction.name" as const,
      },
      {
        Header: "Name",
        accessor: "name" as const,
      },
      {
        Header: "Class",
        accessor: "fighterClass.name" as const,
      },
      {
        Header: "Cost",
        accessor: "cost" as const,
      },
    ],
    []
  );

  return (
    <AdminTable
      columns={columns}
      data={fighterPrototypes}
      deleteButton={DeleteFighterPrototype}
    />
  );
}

function DeleteFighterPrototype({ id }: { id: string }) {
  const {
    isLoading: isDeleteLoading,
    deleteFighterPrototype,
  } = useDeleteFighterPrototype();
  const handleDelete = () => deleteFighterPrototype(id);

  return (
    <Button onClick={handleDelete} disabled={isDeleteLoading}>
      Delete
    </Button>
  );
}

interface FighterPrototypeFormData {
  name: string;
  cost: number;
  factionId: string;
  fighterClassId: string;
}

function CreateFighterPrototype() {
  const { isLoading, postFighterPrototype } = useCreateFighterPrototype();
  const {
    isLoading: isFighterClassLoading,
    fighterClasses,
  } = useReadFighterClasses();
  const { isLoading: isFactionLoading, factions } = useReadFactions();
  const { register, handleSubmit, reset } = useForm<FighterPrototypeFormData>();

  const convertFormToDto = ({
    name,
    cost,
    fighterClassId,
    factionId,
  }: FighterPrototypeFormData) => {
    const maybeDto = {
      name,
      cost,
      fighterClass: fighterClasses.find((fc) => fc.id === fighterClassId),
      faction: factions.find((f) => f.id === factionId),
    };

    return createFighterPrototypeDtoSchema.parse(maybeDto);
  };

  const onSubmit = async (formData: FighterPrototypeFormData) => {
    const createFighterPrototypeDto = convertFormToDto(formData);
    await postFighterPrototype(createFighterPrototypeDto);
    reset();
  };

  if (isFighterClassLoading || isFactionLoading) return <div>Loading...</div>;

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      heading="Create New Fighter Prototype"
    >
      <FormControl id="fighter-prototype-name" isRequired>
        <FormLabel>Fighter Prototype Name</FormLabel>
        <Input name="name" ref={register({ required: true })} />
      </FormControl>
      <FormControl id="fighter-class" isRequired>
        <FormLabel>Select Fighter class:</FormLabel>
        <Select
          name="fighterClassId"
          ref={register({ required: true })}
          placeholder="Select option"
        >
          {fighterClasses.map((fighterClass: any) => (
            <option key={fighterClass.id} value={fighterClass.id}>
              {fighterClass.name}
            </option>
          ))}
        </Select>
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
      <FormControl id="cost" isRequired>
        <FormLabel>Cost:</FormLabel>
        <Input
          type="number"
          name="cost"
          ref={register({ required: true, valueAsNumber: true })}
        />
      </FormControl>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Submit"}
      </Button>
    </Form>
  );
}
