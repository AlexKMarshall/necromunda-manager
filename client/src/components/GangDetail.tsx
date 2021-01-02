import {
  Box,
  Heading,
  Spinner,
  Table,
  Text,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useReadFighterPrototypes } from "../hooks/fighter-prototypes";
import { useReadGangDetail } from "../hooks/gangs";
import { useCreatePuchase } from "../hooks/purchase";
import { FighterPrototype } from "../schemas/fighter-prototype.schema";
import Fighters from "./Fighters";

interface Basket {
  items: FighterPrototype[];
}

export default function GangDetail() {
  const { gangId } = useParams<{ gangId: string }>();
  const { isLoading, error, gangDetail } = useReadGangDetail(gangId);
  const { fighterPrototypes } = useReadFighterPrototypes();
  const [basket, setBasket] = useState<Basket>({ items: [] });
  const { createPurchase } = useCreatePuchase(gangId);

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
  if (isLoading) return <Spinner />;
  if (!gangDetail) throw new Error("impossible state");

  const filteredFighterPrototypes = fighterPrototypes.filter(
    (fp) => fp.faction.name === gangDetail?.faction.name
  );

  const addToBasket = (fp: FighterPrototype) =>
    setBasket(({ items: oldItems }) => ({ items: [...oldItems, fp] }));

  const basketTotal = basket.items.reduce((acc, curr) => acc + curr.cost, 0);
  const availableFunds = gangDetail.stash - basketTotal;

  const handlePurchase = () => {
    createPurchase({ fighterPrototypeIds: basket.items.map((fp) => fp.id) });
  };

  return (
    <Box>
      <Heading>{gangDetail.name}</Heading>
      <Text>{gangDetail.faction.name}</Text>
      <Text>Stash - {gangDetail.stash}</Text>
      <Fighters fighters={gangDetail.fighters} />
      <Heading size="md" as="h3">
        Available Fighters to Purchase
      </Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Fighter Type</Th>
            <Th>Class</Th>
            <Th>Cost</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredFighterPrototypes.map((fp) => (
            <Tr key={fp.id}>
              <Td>{fp.name}</Td>
              <Td>{fp.fighterClass.name}</Td>
              <Td>{fp.cost}</Td>
              <Td>
                <Button onClick={() => addToBasket(fp)} type="button">
                  Add to Basket
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Heading size="md" as="h3">
        Basket
      </Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Fighter Type</Th>
            <Th>Cost</Th>
          </Tr>
        </Thead>
        <Tbody>
          {basket.items.map((fp, index) => (
            <Tr key={index}>
              <Td>{fp.name}</Td>
              <Td>{fp.cost}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Text>Total cost - {basketTotal}</Text>
      <Text>Available funds - {availableFunds}</Text>
      <Button onClick={handlePurchase}>Purchase</Button>
    </Box>
  );
}
