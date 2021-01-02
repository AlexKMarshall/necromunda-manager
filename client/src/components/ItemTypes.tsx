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
  useCreateItemType,
  useDeleteItemType,
  useReadItemTypes,
} from "../hooks/item-types";
import { createItemTypeDtoSchema, ItemType } from "../schemas/item-type.schema";

export default function ItemTypes() {
  const { isLoading, isError, error, itemTypes } = useReadItemTypes();

  return (
    <Box p={4}>
      <Stack>
        <Heading>ItemTypes</Heading>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <pre>{JSON.stringify(error, null, 2)}</pre>
        ) : (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Item Type</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {itemTypes.map((itemType) => (
                <ItemTypeRow key={itemType.id} itemType={itemType} />
              ))}
            </Tbody>
          </Table>
        )}
      </Stack>
      <CreateItemType />
    </Box>
  );
}

function ItemTypeRow({ itemType }: { itemType: ItemType }) {
  const { isLoading: isDeleteLoading, deleteItemType } = useDeleteItemType();
  const isPendingSave = itemType.id.startsWith("TEMP");

  const handleDelete = () => deleteItemType(itemType.id);

  return (
    <Tr>
      <Td>{itemType.name}</Td>
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

interface ItemTypeFormData {
  name: string;
}

function CreateItemType() {
  const { isLoading, createItemType } = useCreateItemType();
  const { register, handleSubmit, reset, errors } = useForm<ItemTypeFormData>({
    resolver: zodResolver(createItemTypeDtoSchema),
  });

  const onSubmit = async (formData: ItemTypeFormData) => {
    await createItemType(formData);
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} heading="Create New Item Type">
      <FormControl
        id="item-type-name"
        isRequired
        isInvalid={Boolean(errors.name)}
      >
        <FormLabel>Item Type Name</FormLabel>
        <Input name="name" ref={register({ required: true })} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Submit"}
      </Button>
    </Form>
  );
}
