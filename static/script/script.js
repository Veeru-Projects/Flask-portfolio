// dynamic navbar color based on current section
const header = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[data-navcolor]');

function updateNavbarColor() {
    let scrollPos = window.scrollY + header.offsetHeight + 5; // add a small buffer
    let color = '#000000'; // default page color

    sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
            color = sec.getAttribute('data-navcolor') || color;
        }
    });

    header.style.backgroundColor = color;
}

window.addEventListener('scroll', updateNavbarColor);
window.addEventListener('load', updateNavbarColor);

// theme toggle script
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark');
    if (theme === 'dark') {
        document.body.classList.add('theme-dark');
        themeToggle.checked = true;
    } else {
        document.body.classList.add('theme-light');
        themeToggle.checked = false;
    }
}

// load preference
let stored = localStorage.getItem('theme');
if (stored) {
    applyTheme(stored);
} else {
    // default based on prefers-color-scheme
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(prefers);
}

if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

