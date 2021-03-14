import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { FighterCardProps, FighterCard } from ".";

export default {
  title: "FighterCard",
  component: FighterCard,
} as Meta;

const Template: Story<FighterCardProps> = (args) => <FighterCard {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  id: "abc-123",
  name: "Ajex Gorgoth, House Agent",
  stats: {
    m: '4"',
    ws: "2+",
    bs: "5+",
    s: "5",
    t: "4",
    w: "3",
    i: "3+",
    a: "4",
    ld: "8+",
    cl: "5+",
    wil: "6+",
    int: "7+",
  },
  weapons: [
    {
      name: "Autogun",
      stats: {
        rng: { s: '8"', l: '24"' },
        acc: { s: "+1", l: "-" },
        str: "3",
        ap: "-",
        d: "1",
        am: "4+",
        traits: "Rapid Fire (1)",
      },
    },
    {
      name: "Powered servo claw",
      stats: {
        rng: { s: "-", l: "E" },
        acc: { s: "-", l: "-" },
        str: "S+3",
        ap: "-",
        d: "2",
        am: "-",
        traits: "Melee, Pulverise",
      },
    },
    {
      name: "Great chainsword",
      stats: {
        rng: { s: "E", l: '1"' },
        acc: { s: "-1", l: "-" },
        str: "S",
        ap: "-1",
        d: "1",
        am: "-",
        traits: "Melee, Parry, Rending, Versatile",
      },
    },
  ],
  skills: "Bull Charge, Immovable Stance, Naaargah!",
  wargear: "Heavy carapace armour, respirator",
};
