window.onload = function() {
    loadNavbar();
}

function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(content => {
            document.querySelector('#navbar-placeholder').outerHTML = content
        })
        .catch(error => {
            console.error('Error fetching the navbar:', error)
        });
}