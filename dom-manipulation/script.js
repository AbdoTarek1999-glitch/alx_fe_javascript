// Select DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const addQuoteForm = document.getElementById('addQuoteForm');
const quoteInput = document.getElementById('quoteInput');

// Initialize quotes array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Display a random quote
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[randomIndex];
}

// Add a new quote
function addQuote(event) {
  event.preventDefault(); // Prevent page reload
  const newQuote = quoteInput.value.trim();
  if (newQuote) {
    quotes.push(newQuote);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    quoteInput.value = '';
    displayRandomQuote();
  }
}

// Fetch quotes from simulated server
async function fetchQuotesFromServer() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  const serverQuotes = data.slice(0, 5).map(post => post.title); // Take first 5 titles as quotes
  return serverQuotes;
}

// Sync local quotes with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: server data takes precedence
  const combinedQuotes = [...new Set([...serverQuotes, ...quotes])];

  // Simulate sending local quotes to the server
  await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',  // ← sending data
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quotes: combinedQuotes })
  });

  // Update local storage
  quotes = combinedQuotes;
  localStorage.setItem('quotes', JSON.stringify(quotes));

  alert('Quotes synced with server!');
  displayRandomQuote();
}

// Event listeners
addQuoteForm.addEventListener('submit', addQuote);

// Periodic syncing every 30 seconds
setInterval(syncQuotes, 30000);

// Initial display
displayRandomQuote();
