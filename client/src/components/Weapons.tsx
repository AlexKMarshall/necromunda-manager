import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
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
import AdminTable from "./AdminTable";
import { useMemo } from "react";

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
          <WeaponsTable weapons={weapons} />
        )}
      </Stack>
      <CreateWeapon />
    </Box>
  );
}

interface WeaponsTableProps {
  weapons: Weapon[];
}

function WeaponsTable({ weapons }: WeaponsTableProps) {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name" as const,
      },
      {
        Header: "Type",
        accessor: "weaponType" as const,
      },
      {
        Header: "Cost",
        accessor: "cost" as const,
      },
    ],
    []
  );

  return (
    <AdminTable columns={columns} data={weapons} deleteButton={DeleteWeapon} />
  );
}

function DeleteWeapon({ id }: { id: string }) {
  const { isLoading: isDeleteLoading, deleteWeapon } = useDeleteWeapon();
  const handleDelete = () => deleteWeapon(id);

  return (
    <Button onClick={handleDelete} disabled={isDeleteLoading}>
      Delete
    </Button>
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
