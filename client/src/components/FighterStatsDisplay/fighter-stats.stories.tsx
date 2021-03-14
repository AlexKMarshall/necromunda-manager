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
};
