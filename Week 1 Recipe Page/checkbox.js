function setupCheckboxes() {
    var checkboxes = document.querySelectorAll('.checkbox');
    
    checkboxes.forEach(function(checkbox) {
        if (localStorage.getItem(checkbox.id) === 'true') {
            checkbox.checked = true;
        }
        
        checkbox.onclick = function() {
            localStorage.setItem(this.id, this.checked);
            var listItem = this.closest('li');
            listItem.classList.toggle('completed', this.checked);
        };
    });
}

document.addEventListener('DOMContentLoaded', setupCheckboxes);