const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");
const noResults = document.getElementById("noResults");

let data = [];

// Load index
fetch("search-index.json")
  .then(res => res.json())
  .then(json => data = json);

// Simple fuzzy matcher
function fuzzyMatch(text, query) {
  return text.includes(query) || levenshtein(text, query) <= 2;
}

function levenshtein(a, b) {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= a.length; j++) dp[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[j - 1] === b[i - 1] ? 0 : 1)
      );
    }
  }
  return dp[b.length][a.length];
}

function highlight(text, query) {
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

input.addEventListener("input", () => {
  const q = input.value.trim().toLowerCase();
  results.innerHTML = "";
  noResults.hidden = true;

  if (!q) return;

  const matches = data.filter(item =>
    fuzzyMatch(item.title.toLowerCase(), q) ||
    fuzzyMatch(item.content.toLowerCase(), q)
  );

  if (matches.length === 0) {
    noResults.hidden = false;
    return;
  }

  matches.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="${
        ${highlight(item.title, q)}
      </a>
      <p>${highlight(item.content, q)}</p>
    `;
    results.appendChild(li);
  });
});
