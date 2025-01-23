document.addEventListener('DOMContentLoaded', function() {
    // select all bullet list items
    var bulletItems = document.querySelectorAll('.bulletlist li');
    
    // and adds a click handlers
    for (var i = 0; i < bulletItems.length; i++) {
        var item = bulletItems[i];
        
        // for localStorage if page reloads
        var savedState = localStorage.getItem('bullet-' + i);
        if (savedState === 'true') {
            item.classList.add('completed');
        }
        
        // onClick
        item.addEventListener('click', function() {
            //toggle event
            this.classList.toggle('completed');
            
            //saves state
            var index = Array.prototype.indexOf.call(bulletItems, this);
            localStorage.setItem('bullet-' + index, this.classList.contains('completed'));
        });
        
        // change cursor style to show that it's clickable
        item.style.cursor = 'pointer';
    }
});