document.addEventListener('DOMContentLoaded', function() {

    var checkboxes = document.querySelectorAll('.checkbox');
    //localStorage allows checkbox state to remain if page refreshed
    for (var i = 0; i < checkboxes.length; i++) {
        var checkbox = checkboxes[i];
        var savedState = localStorage.getItem(checkbox.id);
        
        if (savedState === 'true') {
            checkbox.checked = true;
        }

        // Add a event listener
        checkbox.addEventListener('change', function() {
            // Save state to localStorage
            localStorage.setItem(this.id, this.checked);

            var listItem = this.closest('li');
            
            if (this.checked) {
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('completed');
            }
        });

        // To uncheck
        var event = new Event('change');
        checkbox.dispatchEvent(event);
    }
});