import React, {ReactElement, useState} from 'react';
import Carousel from '../index';
import {
	Typography,
	Box,
} from '@material-ui/core';
import {ArrowForward, ArrowBack} from '@material-ui/icons';

interface CardSlideProps {
  title: string;
  body: string;
  image: string;
}

const slides: CardSlideProps[] = [
	{
		image: 'https://picsum.photos/300/300',
		title: '',
		body: '',
	},
	{
		image: 'https://picsum.photos/300/300',
		title: '',
		body: '',
	},
	{
		image: 'https://picsum.photos/300/300',
		title: '',
		body: '',
	},
];

const Example = () => (
	<div style={{marginTop: '50px', color: '#494949'}}>
		<Typography variant='h4'>Carousel</Typography>
		<Carousel
			animation='slide'
			navButtonsAlwaysVisible={true}
			autoPlay={false}
			fullHeightHover={false}
			NextIcon={<ArrowForward />}
			PrevIcon={<ArrowBack />}
		>
			{slides.map(({body, image, title}: CardSlideProps) => (
				<CardSlide key={title} body={body} image={image} title={title} />
			))}
		</Carousel>
	</div>
);

const CardSlide: React.FC<CardSlideProps> = ({title, body, image}): ReactElement => (
	<Box textAlign='center'>
		<img src={image} alt={title} width='300' height='300' />
		<Typography>{title}</Typography>
		<Typography>
			{body}
		</Typography>
	</Box>
);

export default Example;
