function searchContent(query) {
    var results = [];
    
    contentIndex.forEach(function(entry) {
        for (var i = 0; i < entry.keywords.length; i++) {
            if (entry.keywords[i].toLowerCase().includes(query.toLowerCase())) {
                results.push(entry);
                break;
            }
        }
    });

    displayResults(results);
}

function displayResults(results) {
    var resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = ""; 

    if (results.length === 0) {
        resultsContainer.innerHTML = "No results found.";
        return;
    }

    results.forEach(function(result) {
        var resultElement = document.createElement("a");
        resultElement.href = result.link;
        resultElement.textContent = result.title;
        resultsContainer.appendChild(resultElement);
    });
}

document.getElementById('search-input').addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        e.preventDefault(); 
        searchContent(this.value);
    }
});
