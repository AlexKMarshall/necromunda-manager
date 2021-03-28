import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { AddFighter } from ".";

export default {
  title: "AddFighter",
  component: AddFighter,
} as Meta;

type AddFighterProps = React.ComponentPropsWithoutRef<typeof AddFighter>;

const Template: Story<AddFighterProps> = (args) => <AddFighter {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  fighterPrototypes: [
    {
      id: "1",
      name: "Road Captain",
      cost: 105,
    },
    {
      id: "2",
      name: "Road Sergeant",
      cost: 80,
    },
  ],
};
