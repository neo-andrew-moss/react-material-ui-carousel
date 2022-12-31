import React, {useState, useEffect} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import {sanitizeProps, useInterval} from './util';
import {CarouselItem} from './CarouselItem';
import {Indicators} from './Indicators';
import {CarouselProps} from './types';

const styles = makeStyles(() =>
	createStyles({
		root: {
			position: 'relative',
			overflow: 'hidden',
		},
		item: {
			position: 'absolute',
			height: '100%',
			width: '100%',
			//    FlexGrow: 1
		},
		itemWrapper: {
			position: 'relative',
			width: '100%',
			height: '100%',
		},
		buttonWrapper: {
			position: 'absolute',
			height: '100px',
			backgroundColor: 'transparent',
			zIndex: 1,
			top: 'calc(50% - 70px)',
			'&:hover': {
				'& $button': {
					backgroundColor: 'black',
					filter: 'brightness(120%)',
					opacity: '0.4',
				},
			},
		},
		fullHeightHoverWrapper: {
			height: '100%', // This is 100% - indicator height - indicator margin
			top: '0',
		},
		fullHeightHoverButton: {},
		buttonVisible: {
			opacity: '1',
		},
		buttonHidden: {
			opacity: '0',
		},
		button: {
			margin: '0 10px',
			position: 'relative',
			backgroundColor: '#494949',
			top: 'calc(50% - 20px) !important',
			color: 'white',
			fontSize: '30px',
			transition: '200ms',
			cursor: 'pointer',
			'&:hover': {
				opacity: '0.6 !important',
			},
		},
		next: {
			right: 0,
		},
		prev: {
			left: 0,
		},
	}),
);

export const Carousel = (props: CarouselProps) => {
	const [state, setState] = useState({
		active: 0,
		prevActive: 0,
		next: true,
	});
	const [childrenHeight, setChildrenHeight] = useState<number>(0);
	const [paused, setPaused] = useState<boolean>(false);

	const classes = styles();

	const sanitizedProps = sanitizeProps(props);

	// ComponentDidMount & onIndexChange
	useEffect(() => {
		const {index, changeOnFirstRender} = sanitizedProps;
		setNext(index, true, changeOnFirstRender);
	}, [sanitizedProps.index]);

	useInterval(() => {
		const {autoPlay} = sanitizedProps;

		if (autoPlay && !paused) {
			next(undefined);
		}
	}, sanitizedProps.interval);

	const next = (event: any) => {
		const {children, cycleNavigation} = sanitizedProps;

		const last = Array.isArray(children) ? children.length - 1 : 0;
		const nextActive
            = state.active + 1 > last
            	? cycleNavigation
            		? 0
            		: state.active
            	: state.active + 1;

		setNext(nextActive, true);

		if (event) {
			event.stopPropagation();
		}
	};

	const prev = (event: any) => {
		const {children, cycleNavigation} = sanitizedProps;

		const last = Array.isArray(children) ? children.length - 1 : 0;
		const nextActive
            = state.active - 1 < 0
            	? cycleNavigation
            		? last
            		: state.active
            	: state.active - 1;

		setNext(nextActive, false);

		if (event) {
			event.stopPropagation();
		}
	};

	const setNext = (index: number, isNext: boolean, runCallbacks = true) => {
		const {onChange, children, strictIndexing} = sanitizedProps;

		if (Array.isArray(children)) {
			if (strictIndexing && index > children.length - 1) {
				index = children.length - 1;
			}

			if (strictIndexing && index < 0) {
				index = 0;
			}
		} else {
			index = 0;
		}

		if (runCallbacks) {
			if (isNext !== undefined) {
				isNext
					? sanitizedProps.next(index, state.active)
					: sanitizedProps.prev(index, state.active);
			}

			onChange(index, state.active);
		}

		if (isNext === undefined) {
			isNext = index > state.active;
		}

		setState({
			active: index,
			prevActive: state.active,
			next: isNext,
		});
	};

	const {
		children,
		className,

		height,

		stopAutoPlayOnHover,
		animation,
		duration,
		swipe,

		navButtonsAlwaysInvisible,
		navButtonsAlwaysVisible,
		cycleNavigation,
		fullHeightHover,
		navButtonsProps,
		navButtonsWrapperProps,
		NavButton,

		NextIcon,
		PrevIcon,

		indicators,
		indicatorContainerProps,
		indicatorIconButtonProps,
		activeIndicatorIconButtonProps,
		IndicatorIcon,
	} = sanitizedProps;

	const {
		className: buttonsClass,
		style: buttonsStyle,
		...buttonsProps
	} = navButtonsProps;
	const {
		className: buttonsWrapperClass,
		style: buttonsWrapperStyle,
		...buttonsWrapperProps
	} = navButtonsWrapperProps;

	const buttonVisibilityClassValue = `${navButtonsAlwaysVisible ? classes.buttonVisible : classes.buttonHidden
	}`;
	const buttonCssClassValue = `${classes.button
	} ${buttonVisibilityClassValue} ${fullHeightHover ? classes.fullHeightHoverButton : ''
	} ${buttonsClass}`;
	const buttonWrapperCssClassValue = `${classes.buttonWrapper} ${fullHeightHover ? classes.fullHeightHoverWrapper : ''
	} ${buttonsWrapperClass}`;

	const showButton = (next = true) => {
		if (cycleNavigation) {
			return true;
		}

		const last = Array.isArray(children) ? children.length - 1 : 0;

		if (next && state.active === last) {
			return false;
		}

		if (!next && state.active === 0) {
			return false;
		}

		return true;
	};

	return (
		<div
			className={`${classes.root} ${className ? className : ''}`}
			onMouseOver={() => {
				stopAutoPlayOnHover && setPaused(true);
			}}
			onMouseOut={() => {
				stopAutoPlayOnHover && setPaused(false);
			}}
			onFocus={() => {
				stopAutoPlayOnHover && setPaused(true);
			}}
			onBlur={() => {
				stopAutoPlayOnHover && setPaused(false);
			}}
		>
			<div className={classes.itemWrapper} style={{height: height ? height : childrenHeight}}>
				{Array.isArray(children) ? (
					children.map((child, index) => (
						<CarouselItem
							key={`carousel-item${index}`}
							state={state}
							index={index}
							maxIndex={children.length - 1}
							child={child}
							animation={animation}
							duration={duration}
							swipe={swipe}
							next={next}
							prev={prev}
							height={height}
							setHeight={setChildrenHeight}
						/>
					))
				) : (
					<CarouselItem
						key={'carousel-item0'}
						state={state}
						index={0}
						maxIndex={0}
						child={children}
						animation={animation}
						duration={duration}
						height={height}
						setHeight={setChildrenHeight}
					/>
				)}
			</div>

			{!navButtonsAlwaysInvisible && showButton(true) && (
				<div
					className={`${buttonWrapperCssClassValue} ${classes.next}`}
					style={buttonsWrapperStyle}
					{...buttonsWrapperProps}
				>
					{NavButton !== undefined ? (
						NavButton({
							onClick: next,
							className: buttonCssClassValue,
							style: buttonsStyle,
							next: true,
							prev: false,
							...buttonsProps,
						})
					) : (
						<IconButton
							className={`${buttonCssClassValue}`}
							onClick={next}
							aria-label='Next'
							style={buttonsStyle}
							{...buttonsProps}
						>
							{NextIcon}
						</IconButton>
					)}
				</div>
			)}

			{!navButtonsAlwaysInvisible && showButton(false) && (
				<div
					className={`${buttonWrapperCssClassValue} ${classes.prev}`}
					style={buttonsWrapperStyle}
					{...buttonsWrapperProps}
				>
					{NavButton !== undefined ? (
						NavButton({
							onClick: prev,
							className: buttonCssClassValue,
							style: navButtonsProps.style,
							next: false,
							prev: true,
							...buttonsProps,
						})
					) : (
						<IconButton
							className={`${buttonCssClassValue}`}
							onClick={prev}
							aria-label='Previous'
							style={navButtonsProps.style}
							{...buttonsProps}
						>
							{PrevIcon}
						</IconButton>
					)}
				</div>
			)}

			{indicators ? (
				<Indicators
					length={Array.isArray(children) ? children.length : 0}
					active={state.active}
					press={setNext}
					indicatorContainerProps={indicatorContainerProps}
					indicatorIconButtonProps={indicatorIconButtonProps}
					activeIndicatorIconButtonProps={activeIndicatorIconButtonProps}
					IndicatorIcon={IndicatorIcon}
				/>
			) : null}
		</div>
	);
};

export default Carousel;
