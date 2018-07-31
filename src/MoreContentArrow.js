const arrowIcon = document.querySelector('.arrow-2').children[0];
const scrollToBottom = () => window.scrollTo(0, document.body.scrollHeight);
const scrollToTop = () => window.scrollTo(0, 0);
const arrowContainer = document.querySelector('.arrow-container');
const VIEW_PORT_PERCENTAGE_SHOULD_ROTATE_ANGLE = 0.6;

arrowContainer.addEventListener('click', function() {
	if(isArrowPointingUpwards()) {
		scrollToTop();
	} else {
		scrollToBottom();
	}
});

// https://stackoverflow.com/a/49989567/5111904
window.addEventListener('scroll', function() {
	let yOffset = this.scrollY;
	let innerHeight = window.innerHeight;

	if(yOffset > VIEW_PORT_PERCENTAGE_SHOULD_ROTATE_ANGLE * innerHeight) {
		pointArrowUpwards();
	} else {
		pointArrowDownwards();
	}
});

function isArrowPointingUpwards() {
	return arrowIcon.classList.contains('fa-angle-up');
}

function pointArrowUpwards() {
	if(arrowIcon.classList.contains('fa-angle-down')) {
		arrowIcon.classList.remove('fa-angle-down');
		arrowIcon.classList.add('fa-angle-up');
	}
}

function pointArrowDownwards() {
	if(arrowIcon.classList.contains('fa-angle-up')) {
		arrowIcon.classList.remove('fa-angle-up');
		arrowIcon.classList.add('fa-angle-down');
	}
}