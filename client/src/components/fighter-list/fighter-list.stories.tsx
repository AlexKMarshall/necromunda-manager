import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { FighterList } from ".";

export default {
  title: "FighterList",
  component: FighterList,
} as Meta;

type FighterListProps = React.ComponentPropsWithoutRef<typeof FighterList>;

const Template: Story<FighterListProps> = (args) => <FighterList {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  fighters: [
    {
      name: "John",
      fighterPrototype: "Forge Boss",
      cost: 152,
      xp: 15,
      advancements: 2,
      recovery: "false",
      capturedBy: "",
      lastingInjuries: "Head Injury",
    },
    {
      name: "Mike",
      fighterPrototype: "Bully",
      cost: 62,
      xp: 0,
      advancements: 0,
      recovery: "true",
      capturedBy: "",
      lastingInjuries: "",
    },
    {
      name: "Susan",
      fighterPrototype: "Forge Tyrant",
      cost: 221,
      xp: 4,
      advancements: 1,
      recovery: "false",
      capturedBy: "Gareth",
      lastingInjuries: "",
    },
  ],
};
