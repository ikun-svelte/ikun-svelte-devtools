function updateOffset(left: number, top: number, dom: HTMLElement) {
	dom.style.left = `${left}px`;
	dom.style.top = `${top}px`;
	dom.style.transform = 'translate(0%, 0%)';
}

export function babbleInteract(domId: string, clickFn?: Function) {
	const interactDom = document.querySelector(domId) as HTMLElement;
	let isDragging = false;
	let initialX, initialY;
	// screen size
	const screenWidth = document.body.offsetWidth;
	const screenHeight = document.body.offsetHeight;
	// interact dom size
	let eWidth = 0;
	let eHeight = 0;
	if (interactDom) {
		eWidth = interactDom.offsetWidth;
		eHeight = interactDom.offsetHeight;
	}
	// max drag left/bottom
	const maxLeft = screenWidth - eWidth;
	const maxBottom = screenHeight - eHeight;

	let handleMouseDown, handleMouseEnter, handleMouseLeave, handleClick;

	let initialDomLeft = 0;
	let initialDomTop = 0;
	function drag() {
		if (interactDom) {
			handleMouseDown = (event: MouseEvent) => {
				event.preventDefault();
				interactDom.style.transition = 'none';
				isDragging = true;
				initialX = event.clientX - interactDom.offsetLeft;
				initialY = event.clientY - interactDom.offsetTop;
				initialDomLeft = interactDom.offsetLeft;
				initialDomTop = interactDom.offsetTop;
			};
			interactDom.addEventListener('mousedown', handleMouseDown);

			handleClick = () => {
				if (
					interactDom.offsetLeft - initialDomLeft === 0 &&
					interactDom.offsetTop - initialDomTop === 0 &&
					clickFn
				)
					clickFn();
			};
			interactDom.addEventListener('mouseup', handleClick);

			document.onmousemove = wrapperEvt('onmousemove', (event) => {
				if (isDragging) {
					let left = Math.max(event.clientX - initialX, 0);
					let top = Math.max(event.clientY - initialY, 0);
					top = Math.min(top, maxBottom);
					left = Math.min(left, maxLeft);
					// update dom position
					updateOffset(left, top, interactDom);
				}
			});

			document.onmouseup = wrapperEvt('onmouseup', () => {
				if (isDragging) isDragging = false;
			});
		}
	}
	drag();

	function clearEvt() {
		interactDom.removeEventListener('mouseleave', handleMouseLeave);
		interactDom.removeEventListener('mouseenter', handleMouseEnter);
		interactDom.removeEventListener('mousedown', handleMouseDown);
		interactDom.removeEventListener('click', handleClick);
		document.onmouseup = document.onmousemove = null;
	}
	return clearEvt;
}

// The user may have set up a layer of events themselves,
// and here a layer is wrapped
export function wrapperEvt(evtName: string, cb: any) {
	if (document[evtName]) {
		const orgEvt = document[evtName];
		return () => {
			orgEvt();
			cb();
		};
	} else {
		return cb;
	}
}
