export function dragResize(node: HTMLElement, params) {
	const PANEL_MIN = 20;
	const PANEL_MAX = 100;
	let width = 60;
	let height = 60;
	let bottom = '4%';
	let left = '20%';
	let initialY = 0;
	let initialX = 0;
	let { isResizing, iframeInner } = params;
	function setResizingType(type: string) {
		isResizing = type;
	}

	function resetResizingType() {
		setResizingType('');
		iframeInner && (iframeInner.style.pointerEvents = 'auto');
	}

	function setInitialPosition(e: MouseEvent) {
		if (node) {
			initialX = e.clientX - node.offsetLeft;
			initialY = e.clientY - node.offsetTop;
		}
	}

	function computeSize(e: MouseEvent) {
		if (!isResizing) return;

		const box = iframeInner!.getBoundingClientRect();

		if (isResizing.includes('r')) {
			const widthPx = Math.abs(e.clientX - (box?.left || 0));
			width = Math.min(PANEL_MAX, Math.max(PANEL_MIN, (widthPx / window.innerWidth) * 100));
		}

		if (isResizing.includes('t')) {
			const heightPx = Math.abs((box?.bottom || 0) - e.clientY);
			height = Math.min(PANEL_MAX, Math.max(PANEL_MIN, (heightPx / window.innerHeight) * 100));
		}

		if (isResizing.includes('m')) {
			// drag modal
			let leftCur = Math.max(e.clientX - initialX, 0);
			let bottomCur = e.clientY + initialY + node!.offsetHeight;
			bottom = `calc(100% - ${bottomCur}px)`;
			left = `${Math.min(leftCur, document.body.offsetWidth - node!.offsetWidth)}px`;
		}
		node.style.width = `min(${width}vw, 100vw - 49px)`;
		node.style.height = `min(${height}vh, 100vh - 49px)`;
		node.style.left = left;
		node.style.bottom = bottom;
	}

	function addResizeEvt() {
		window.addEventListener('mousedown', setInitialPosition);
		window.addEventListener('mousemove', computeSize);
		window.addEventListener('mouseup', resetResizingType);
		window.addEventListener('mouseleave', resetResizingType);
	}

	function removeResizeEvt() {
		window.removeEventListener('mousedown', setInitialPosition);
		window.removeEventListener('mousemove', computeSize);
		window.removeEventListener('mouseup', resetResizingType);
		window.removeEventListener('mouseleave', resetResizingType);
	}
	addResizeEvt();
	return {
		update: (parameters: any) => {
			isResizing = parameters.isResizing;
			iframeInner = parameters.iframeInner;
		},
		destroy: () => {
			removeResizeEvt();
		}
	};
}
