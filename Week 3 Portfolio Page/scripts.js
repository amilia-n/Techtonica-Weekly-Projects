function initializeThemeTransition() {
    const themeToggle = document.getElementById('themeToggle');
    
    themeToggle.addEventListener('click', function(event) {
        const x = event.pageX;
        const y = event.pageY;
        
        const currentPage = document.querySelector('.page.active');
        const nextPage = currentPage.classList.contains('theme-dusk') 
            ? document.querySelector('.theme-dawn') 
            : document.querySelector('.theme-dusk');
        
        nextPage.style.zIndex = parseInt(getComputedStyle(currentPage).zIndex) + 1;
        
        nextPage.style.clipPath = `circle(0% at ${x}px ${y}px)`;
        
        anime({
            targets: nextPage,
            duration: 800,
            easing: 'easeInOutQuad',
            update: function(anim) {
                nextPage.style.clipPath = `circle(${anim.progress * 2}% at ${x}px ${y}px)`;
            },
            complete: function() {
                currentPage.classList.remove('active');
                nextPage.classList.add('active');

                if (nextPage.classList.contains('theme-dawn')) {
                    document.body.classList.add('theme-dawn');
                    document.body.classList.remove('theme-dusk');
                } else {
                    document.body.classList.remove('theme-dawn');
                    document.body.classList.add('theme-dusk');
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeThemeTransition);

