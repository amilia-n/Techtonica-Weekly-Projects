function setupBulletList() {
    var bulletItems = document.querySelectorAll('.bulletlist li');
    
    bulletItems.forEach(function(item, index) {
        if (localStorage.getItem('bullet-' + index) === 'true') {
            item.classList.add('completed');
        }
        
        item.style.cursor = 'pointer';
        item.onclick = function() {
            this.classList.toggle('completed');
            localStorage.setItem('bullet-' + index, this.classList.contains('completed'));
        };
    });
}

document.addEventListener('DOMContentLoaded', setupBulletList);