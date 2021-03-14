import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { SkillsWargearProps, SkillsWargear } from ".";

export default {
  title: "SkillsWargear",
  component: SkillsWargear,
} as Meta;

const Template: Story<SkillsWargearProps> = (args) => (
  <SkillsWargear {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  skills: "Bull Charge, Immovable Stance, Naaargah!",
  wargear: "Heavy carapace armour, respirator",
};
