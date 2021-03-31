import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { FighterStatsDisplay, FighterStatsProps } from ".";

export default {
  title: "FighterStats",
  component: FighterStatsDisplay,
} as Meta;

const Template: Story<FighterStatsProps> = (args) => (
  <FighterStatsDisplay {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  fighterId: "abc-123",
  fighterStats: {
    movement: '4"',
    weaponSkill: "2+",
    ballisticSkill: "5+",
    strength: "5",
    toughness: "4",
    wounds: "3",
    initiative: "3+",
    attacks: "4",
    leadership: "8+",
    cool: "5+",
    will: "6+",
    intelligence: "7+",
  },
};
