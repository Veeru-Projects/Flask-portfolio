// dynamic navbar color based on current section
const header = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[data-navcolor]');

function updateNavbarColor() {
    let scrollPos = window.scrollY + header.offsetHeight + 5; // add a small buffer
    let color = '#1d2255'; // default page color

    sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
            color = sec.getAttribute('data-navcolor') || color;
        }
    });

    header.style.backgroundColor = color;
}

window.addEventListener('scroll', updateNavbarColor);
window.addEventListener('load', updateNavbarColor);

