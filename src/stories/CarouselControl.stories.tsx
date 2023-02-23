import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import Example from './Carousel';

export default {
	title: 'Example/CarouselControl',
	component: Example,
	parameters: {
		// More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
} as ComponentMeta<typeof Example>;

const Template: ComponentStory<typeof Example> = args => <Example {...args} />;

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
