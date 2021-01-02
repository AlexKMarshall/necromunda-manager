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
  Select,
  Stack,
  Spinner,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Form, FormControl } from "./Form";
import {
  useCreateWeapon,
  useDeleteWeapon,
  useReadWeapons,
} from "../hooks/weapons";
import {
  createWeaponDtoSchema,
  Weapon,
  WeaponType,
  weaponTypes,
} from "../schemas/weapon.schema";

export default function Weapons() {
  const { isLoading, isError, error, weapons } = useReadWeapons();

  return (
    <Box p={4}>
      <Stack>
        <Heading>Weapons</Heading>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <pre>{JSON.stringify(error, null, 2)}</pre>
        ) : (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Cost</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {weapons.map((weapon) => (
                <WeaponRow key={weapon.id} weapon={weapon} />
              ))}
            </Tbody>
          </Table>
        )}
      </Stack>
      <CreateWeapon />
    </Box>
  );
}

function WeaponRow({ weapon }: { weapon: Weapon }) {
  const { isLoading: isDeleteLoading, deleteWeapon } = useDeleteWeapon();
  const isPendingSave = weapon.id.startsWith("TEMP");

  const handleDelete = () => deleteWeapon(weapon.id);

  return (
    <Tr>
      <Td>{weapon.name}</Td>
      <Td>{weapon.weaponType}</Td>
      <Td>{weapon.cost}</Td>
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

interface WeaponFormData {
  name: string;
  cost: number;
  weaponType: WeaponType;
}

function CreateWeapon() {
  const { isLoading, createWeapon } = useCreateWeapon();
  const { register, handleSubmit, reset, errors } = useForm<WeaponFormData>({
    resolver: zodResolver(createWeaponDtoSchema),
  });

  const onSubmit = async (formData: WeaponFormData) => {
    await createWeapon(formData);
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} heading="Create New Weapon">
      <FormControl id="weapon-name" isRequired isInvalid={Boolean(errors.name)}>
        <FormLabel>Weapon Name</FormLabel>
        <Input name="name" ref={register({ required: true })} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <FormControl id="weapon-type" isRequired>
        <FormLabel>Select Weapon Type:</FormLabel>
        <Select
          name="weaponType"
          ref={register({ required: true })}
          placeholder="Select option"
        >
          {weaponTypes.map((weapon) => (
            <option key={weapon} value={weapon}>
              {weapon}
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
