import React, {ReactNode, useEffect, useRef, useCallback} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {
	AnimatePresence,
	motion,
	MotionProps,
	PanInfo,
} from 'framer-motion/dist/framer-motion';

const styles = makeStyles(() =>
	createStyles({
		item: {
			position: 'absolute',
			height: '100%',
			width: '100%',
			//    FlexGrow: 1
		},
	}),
);

export type CarouselItemProps = {
	animation: 'fade' | 'slide';
	next?: Function;
	prev?: Function;
	state: {
		active: number;
		prevActive: number;
		next: boolean;
	};
	swipe?: boolean;
	index: number;
	maxIndex: number;
	duration: number;
	child: ReactNode;
	height?: number | string; // TODO: SMH why
	setHeight: Function;
};

export const CarouselItem = ({
	animation,
	next,
	prev,
	swipe,
	state,
	index,
	maxIndex,
	duration,
	child,
	height,
	setHeight,
}: CarouselItemProps) => {
	const classes = styles();
	const slide = animation === 'slide';
	const fade = animation === 'fade';

	const dragProps: MotionProps = {
		drag: 'x',
		layout: true,
		onDragEnd(
			event: MouseEvent | TouchEvent | PointerEvent,
			info: PanInfo,
		): void {
			if (!swipe) {
				return;
			}

			if (info.offset.x > 0) {
				prev && prev();
			} else if (info.offset.x < 0) {
				next && next();
			}

			event.stopPropagation();
		},
		dragElastic: 0,
		dragConstraints: {left: 0, right: 0},
	};

	const divRef = useRef<any>(null);

	const checkAndSetHeight = useCallback(() => {
		if (index !== state.active) {
			return;
		}

		if (!divRef.current) {
			return;
		}

		if (divRef.current.offsetHeight === 0) {
			setTimeout(() => {
				checkAndSetHeight();
			}, 100);
		} else {
			setHeight(divRef.current.offsetHeight);
		}
	}, [setHeight, state.active, index, divRef]);

	// Set height on every child change
	useEffect(() => {
		checkAndSetHeight();
	}, [checkAndSetHeight]);

	const variants = {
		leftwardExit: {
			x: slide ? '-100%' : undefined,
			opacity: fade ? 0 : undefined,
			zIndex: 0,
			// Position: 'relative'
		},
		leftOut: {
			x: slide ? '-100%' : undefined,
			opacity: fade ? 0 : undefined,
			display: 'none',
			zIndex: 0,
			// Position: 'relative'
		},
		rightwardExit: {
			x: slide ? '100%' : undefined,
			opacity: fade ? 0 : undefined,
			zIndex: 0,
			// Position: 'relative'
		},
		rightOut: {
			x: slide ? '100%' : undefined,
			opacity: fade ? 0 : undefined,
			display: 'none',
			zIndex: 0,
			// Position: 'relative'
		},
		center: {
			x: 0,
			opacity: 1,
			zIndex: 1,
			// Position: 'relative'
		},
	};

	// Handle animation directions and opacity given based on active, prevActive and this item's index
	const {active, next: isNext, prevActive} = state;
	let animate = 'center';
	if (index === active) {
		animate = 'center';
	} else if (index === prevActive) {
		animate = isNext ? 'leftwardExit' : 'rightwardExit';
		if (active === maxIndex && index === 0) {
			animate = 'rightwardExit';
		}

		if (active === 0 && index === maxIndex) {
			animate = 'leftwardExit';
		}
	} else {
		animate = index < active ? 'leftOut' : 'rightOut';
		if (active === maxIndex && index === 0) {
			animate = 'rightOut';
		}

		if (active === 0 && index === maxIndex) {
			animate = 'leftOut';
		}
	}

	duration /= 1000;

	return (
		<div className={classes.item} >
			<AnimatePresence custom={isNext}>
				<motion.div {...(swipe && dragProps)} style={{height: '100%'}}>
					<motion.div
						custom={isNext}
						variants={variants}
						animate={animate}
						transition={{
							x: {type: 'tween', duration, delay: 0},
							opacity: {duration},
						}}
						style={{position: 'relative', height: '100%'}}
					>
						                        <div ref={divRef} style={{height}}>
							{child}
						</div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};
