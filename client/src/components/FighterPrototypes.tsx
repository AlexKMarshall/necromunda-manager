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
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Faction</Th>
                <Th>Name</Th>
                <Th>Class</Th>
                <Th>Cost</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {fighterPrototypes.map((fp: any) => (
                <FighterPrototypeRow fighterPrototype={fp} key={fp.id} />
              ))}
            </Tbody>
          </Table>
        )}
        <CreateFighterPrototype />
      </Stack>
    </Box>
  );
}

interface FighterPrototypeRowProps {
  fighterPrototype: FighterPrototype;
}

function FighterPrototypeRow({ fighterPrototype }: FighterPrototypeRowProps) {
  const {
    isLoading: isDeleteLoading,
    deleteFighterPrototype,
  } = useDeleteFighterPrototype();
  const isPendingSave = fighterPrototype.id.startsWith("TEMP");

  const handleDelete = () => deleteFighterPrototype(fighterPrototype.id);

  return (
    <Tr>
      <Td>{fighterPrototype.faction.name}</Td>
      <Td>{fighterPrototype.name}</Td>
      <Td>{fighterPrototype.fighterClass.name}</Td>
      <Td>{fighterPrototype.cost}</Td>
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
