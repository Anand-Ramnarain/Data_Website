document.addEventListener("DOMContentLoaded", function() {

    // Toggle search bar visibility
    document.getElementById('search-btn').addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default behavior of the anchor tag

        var input = document.getElementById('search-input');
        if (input.style.display === "none" || input.style.display === "") {
            input.style.display = "block";
            input.focus(); // Immediately allow the user to type
        } else {
            input.style.display = "none";
        }
    });

    // Listen for "Enter" keypress in search bar
    document.getElementById('search-input').addEventListener('keydown', function(e) {
        if (e.keyCode === 13) { // If "Enter" key is pressed
            alert('Search for: ' + this.value); // For demonstration purposes. Implement actual search here.
        }
    });
});
