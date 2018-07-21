const arrowContainer = document.querySelector('.arrow-container');
const scrollToBottom = () => window.scrollTo(0, document.body.scrollHeight);

arrowContainer.addEventListener('click', () => {scrollToBottom();});