import * as d3 from 'd3';
const arrowContainer = document.querySelector('.arrow-container');
const angleDown = document.querySelector('.fa-angle-down');
const scrollToBottom = () => window.scrollTo(0, document.body.scrollHeight);
const scrollToTop = () => window.scrollTo(0, 0);
let arrowPosition = 'upwards';

arrowContainer.addEventListener('click', () => {
	// trigger arrow animaton
	angleDown.classList.remove(arrowPosition);
	arrowPosition = arrowPosition === 'upwards' ? 'downwards' : 'upwards';
	if(arrowPosition === 'upwards') {
		scrollToBottom();
	} else  {
		scrollToTop();
	}
	angleDown.classList.add(arrowPosition);
});