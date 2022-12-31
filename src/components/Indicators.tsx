import React, {ReactNode} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import {SanitizedCarouselNavProps} from './util';

const styles = makeStyles(() =>
	createStyles({
		indicators: {
			width: '100%',
			marginTop: '10px',
			textAlign: 'center',
		},
		indicator: {
			cursor: 'pointer',
			transition: '200ms',
			padding: 0,
			color: '#afafaf',
			'&:hover': {
				color: '#1f1f1f',
			},
			'&:active': {
				color: '#1f1f1f',
			},
		},
		indicatorIcon: {
			fontSize: '15px',
		},
		active: {
			color: '#494949',
		},
	}),
);

export type IndicatorProps = {
	IndicatorIcon?: ReactNode;
	length: number;
	active: number;
	press: Function;
	indicatorContainerProps: SanitizedCarouselNavProps;
	indicatorIconButtonProps: SanitizedCarouselNavProps;
	activeIndicatorIconButtonProps: SanitizedCarouselNavProps;
};

export const Indicators = (props: IndicatorProps) => {
	const classes = styles();
	const IndicatorIcon
        = props.IndicatorIcon !== undefined ? (
        	props.IndicatorIcon
        ) : (
        	<FiberManualRecordIcon
        		// Size='small'
        		className={classes.indicatorIcon}
        	/>
        );
	const {
		className: indicatorIconButtonClass,
		style: indicatorIconButtonStyle,
		...indicatorIconButtonProps
	} = props.indicatorIconButtonProps;
	const {
		className: activeIndicatorIconButtonClass,
		style: activeIndicatorIconButtonStyle,
		...activeIndicatorIconButtonProps
	} = props.activeIndicatorIconButtonProps;

	const indicators = [];
	for (let i = 0; i < props.length; i++) {
		const className
            = i === props.active
            	? `${classes.indicator} ${indicatorIconButtonClass} ${classes.active} ${activeIndicatorIconButtonClass}`
            	: `${classes.indicator} ${indicatorIconButtonClass}`;

		const style
            = i === props.active
            	? {...indicatorIconButtonStyle, ...activeIndicatorIconButtonStyle}
            	: indicatorIconButtonStyle;

		const restProps
            = i === props.active
            	? {...indicatorIconButtonProps, ...activeIndicatorIconButtonProps}
            	: indicatorIconButtonProps;

		if (restProps['aria-label'] === undefined) {
			restProps['aria-label'] = 'carousel indicator';
		}

		const item = (
			<IconButton
				key={i}
				className={className}
				style={style}
				onClick={() => {
					props.press(i);
				}}
				size='small'
				{...restProps}
				// Always add the index to any given aria label
				aria-label={`${restProps['aria-label']} ${i + 1}`}
			>
				{IndicatorIcon}
			</IconButton>
		);

		indicators.push(item);
	}

	const {
		className: indicatorContainerClass,
		style: indicatorContainerStyle,
		...indicatorContainerProps
	} = props.indicatorContainerProps;

	return (
		<div
			className={`${classes.indicators} ${indicatorContainerClass}`}
			style={indicatorContainerStyle}
			{...indicatorContainerProps}
		>
			{indicators}
		</div>
	);
};
