fetch('search-index.json')
  .then(response => response.json())
  .then(data => {
    const input = document.getElementById('searchBox');
    const resultsDiv = document.getElementById('searchResults');

    input.addEventListener('keyup', function () {
      const query = this.value.toLowerCase();
      resultsDiv.innerHTML = '';

      if (query.length < 3) return;

      const matches = data.filter(item =>
        item.content.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        resultsDiv.innerHTML = '<p><em>No results found.</em></p>';
        return;
      }

      matches.forEach(item => {
        const result = document.createElement('p');
        result.innerHTML = `<a href="${item.url}"><strong>${item.title}</strong></a>`;
        resultsDiv.appendChild(result);
      });
    });
  });
