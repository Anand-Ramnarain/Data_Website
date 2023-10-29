document.addEventListener("DOMContentLoaded", function() {

    document.getElementById('search-btn').addEventListener('click', function(e) {
        e.preventDefault(); 

        var input = document.getElementById('search-input');
        if (input.style.display === "none" || input.style.display === "") {
            input.style.display = "block";
            input.focus(); 
        } else {
            input.style.display = "none";
        }
    });

    // Listen for "Enter" keypress in search bar
    document.getElementById('search-input').addEventListener('keydown', function(e) {
        if (e.keyCode === 13) { 
            alert('Search for: ' + this.value); 
        }
    });
});
