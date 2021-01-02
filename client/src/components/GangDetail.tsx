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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useReadFighterPrototypes } from "../hooks/fighter-prototypes";
import { useReadGangDetail } from "../hooks/gangs";
import { useCreatePuchase } from "../hooks/purchase";
import { useReadWeapons } from "../hooks/weapons";
import { FighterPrototype } from "../schemas/fighter-prototype.schema";
import { Weapon } from "../schemas/weapon.schema";
import { createTempId } from "../utils";
import Fighters from "./Fighters";

type FighterInBasket = FighterPrototype & {
  fighterTempId: string;
  weapons: Weapon[];
};

interface Basket {
  items: FighterInBasket[];
}

export default function GangDetail() {
  const { gangId } = useParams<{ gangId: string }>();
  const { isLoading, error, gangDetail } = useReadGangDetail(gangId);
  const { fighterPrototypes } = useReadFighterPrototypes();
  const { weapons } = useReadWeapons();
  const [basket, setBasket] = useState<Basket>({ items: [] });
  const { createPurchase } = useCreatePuchase(gangId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFighterTempId, setSelectedFighterTempId] = useState<
    string | null
  >(null);
  const [weaponsToAdd, setWeaponsToAdd] = useState<Weapon[]>([]);

  const weaponsToAddCost = weaponsToAdd.reduce((acc, cur) => acc + cur.cost, 0);

  const handleAddWeaponsClick = useCallback(
    (fighter: FighterInBasket) => {
      setSelectedFighterTempId(fighter.fighterTempId);
      onOpen();
    },
    [onOpen]
  );

  const handleAddWeapons = useCallback(() => {
    setBasket((oldBasket) => {
      const fighterIndex = oldBasket.items.findIndex(
        (f) => f.fighterTempId === selectedFighterTempId
      );
      if (fighterIndex === -1) {
        throw new Error("fighterTempId not found");
      }

      const oldFighter = oldBasket.items[fighterIndex];
      const updatedFighter: FighterInBasket = {
        ...oldFighter,
        weapons: [...oldFighter.weapons, ...weaponsToAdd],
      };

      return {
        ...oldBasket,
        items: [
          ...oldBasket.items.slice(0, fighterIndex),
          updatedFighter,
          ...oldBasket.items.slice(fighterIndex + 1),
        ],
      };
    });
    onClose();
  }, [selectedFighterTempId, weaponsToAdd, onClose]);

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
  if (isLoading) return <Spinner />;
  if (!gangDetail) throw new Error("impossible state");

  const filteredFighterPrototypes = fighterPrototypes.filter(
    (fp) => fp.faction.name === gangDetail?.faction.name
  );

  const addToBasket = (fp: FighterPrototype) =>
    setBasket(({ items: oldItems }) => ({
      items: [
        ...oldItems,
        { ...fp, weapons: [], fighterTempId: createTempId() },
      ],
    }));

  const basketTotal = basket.items.reduce(
    (acc, curr) =>
      acc + curr.cost + curr.weapons.reduce((a, c) => a + c.cost, 0),
    0
  );
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
      <BasketItems basket={basket} handleAddWeapons={handleAddWeaponsClick} />
      <Text>Total cost - {basketTotal}</Text>
      <Text>Available funds - {availableFunds}</Text>
      <Button onClick={handlePurchase}>Purchase</Button>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Weapons</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table>
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
                  <Tr key={weapon.id}>
                    <Td>{weapon.name}</Td>
                    <Td>{weapon.weaponType}</Td>
                    <Td>{weapon.cost}</Td>
                    <Td>
                      <Button
                        onClick={() =>
                          setWeaponsToAdd((oldWeapons) => [
                            ...oldWeapons,
                            weapon,
                          ])
                        }
                      >
                        Add to Basket
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Heading size="sm" as="h3">
              Weapons in Basket
            </Heading>
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Type</Th>
                  <Th>Cost</Th>
                </Tr>
              </Thead>
              <Tbody>
                {weaponsToAdd.map((weapon, index) => (
                  <Tr key={index}>
                    <Td>{weapon.name}</Td>
                    <Td>{weapon.weaponType}</Td>
                    <Td>{weapon.cost}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Heading>
              Remaining funds - {availableFunds - weaponsToAddCost}
            </Heading>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleAddWeapons}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

interface BasketItemsProps {
  basket: Basket;
  handleAddWeapons: (fp: FighterInBasket) => void;
}

function BasketItems({ basket, handleAddWeapons }: BasketItemsProps) {
  return (
    <>
      <Heading size="md" as="h3">
        Basket
      </Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Fighter Type</Th>
            <Th>Cost</Th>
            <Th>No. of Weapons</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {basket.items.map((fp) => (
            <Tr key={fp.fighterTempId}>
              <Td>{fp.name}</Td>
              <Td>{fp.cost}</Td>
              <Td>{fp.weapons.length}</Td>
              <Td>
                <Button onClick={() => handleAddWeapons(fp)}>
                  Add Weapons
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
