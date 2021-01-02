import { Heading, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";

import { Fighter } from "../schemas/fighter.schema";

interface FightersProps {
  fighters: Fighter[];
}

export default function Fighters({ fighters }: FightersProps) {
  return (
    <>
      <Heading size="md" as="h3">
        Fighters
      </Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Cost</Th>
            <Th>XP</Th>
          </Tr>
        </Thead>
        <Tbody>
          {fighters.map((fighter) => (
            <Tr key={fighter.id}>
              <Td>{fighter.name ?? "Please name me"}</Td>
              <Td>{fighter.fighterPrototype.name}</Td>
              <Td>{fighter.cost}</Td>
              <Td>{fighter.xp}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
