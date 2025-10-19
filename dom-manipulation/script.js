// =============================
// Dynamic Quote Generator with Server Sync and Conflict Resolution
// =============================

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const syncStatus = document.getElementById('syncStatus');

// Local storage key
const LOCAL_STORAGE_KEY = 'quotesData';

// Load existing quotes or default ones
let quotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [
  "The best way to get started is to quit talking and begin doing.",
  "Don’t let yesterday take up too much of today.",
  "It’s not whether you get knocked down, it’s whether you get up."
];

// =============================
// Display a Random Quote
// =============================
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[randomIndex];
}

// =============================
// Create Add Quote Form
// =============================
function createAddQuoteForm() {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const button = document.createElement('button');

  input.placeholder = 'Enter a new quote';
  input.required = true;
  button.textContent = 'Add Quote';

  form.appendChild(input);
  form.appendChild(button);
  document.body.appendChild(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newQuote = input.value.trim();
    if (newQuote) {
      addQuote(newQuote);
      input.value = '';
    }
  });
}

// =============================
// Add Quote Function
// =============================
function addQuote(quote) {
  quotes.push(quote);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
  displayRandomQuote();
  syncStatus.textContent = "🟡 New quote added locally (syncing soon)";
  uploadQuotesToServer(); // simulate sync after adding
}

// =============================
// Fetch Quotes (GET)
// =============================
async function fetchQuotesFromServer() {
  try {
    syncStatus.textContent = "🔄 Fetching quotes from server...";
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    // Simulate server quotes
    const serverQuotes = data.slice(0, 5).map(post => post.title);
    resolveConflicts(serverQuotes);

    syncStatus.textContent = "✅ Quotes synced from server!";
  } catch (error) {
    syncStatus.textContent = "❌ Failed to fetch from server!";
    console.error("Fetch error:", error);
  }
}

// =============================
// Upload Quotes (POST)
// =============================
async function uploadQuotesToServer() {
  try {
    syncStatus.textContent = "📤 Uploading quotes to server...";
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // ✅ required for JSON upload
      },
      body: JSON.stringify({ quotes: quotes }),  // ✅ send quotes array
    });

    const result = await response.json();
    console.log("Server response:", result);

    syncStatus.textContent = "✅ Quotes uploaded successfully!";
  } catch (error) {
    syncStatus.textContent = "❌ Upload failed!";
    console.error("Upload error:", error);
  }
}

// =============================
// Conflict Resolution
// =============================
function resolveConflicts(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

  // Merge local + server, prioritizing server content
  const merged = [...new Set([...serverQuotes, ...localQuotes])];
  quotes = merged;

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
  displayRandomQuote();

  alert("Data synced successfully — server data prioritized.");
}

// =============================
// Periodic Auto-Sync
// =============================
function startAutoSync() {
  // Fetch from server every 15 seconds
  setInterval(fetchQuotesFromServer, 15000);
}

// =============================
// Initialize App
// =============================
document.addEventListener('DOMContentLoaded', () => {
  displayRandomQuote();
  createAddQuoteForm();
  startAutoSync();
});

addQuoteBtn.addEventListener('click', displayRandomQuote);
