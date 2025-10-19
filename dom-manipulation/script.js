// =============================
// Dynamic Quote Generator with Server Sync
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
// Add New Quote (Form Generator)
// =============================
function createAddQuoteForm() {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const button = document.createElement('button');

  input.placeholder = 'Enter new quote';
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
  syncStatus.textContent = "🟡 New quote added locally (will sync soon)";
}

// =============================
// Step 1: Simulate Server Interaction
// =============================
async function fetchQuotesFromServer() {
  try {
    syncStatus.textContent = "🔄 Syncing with server...";
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    // Simulate server quotes (take 5 sample posts)
    const serverQuotes = data.slice(0, 5).map(item => item.title);

    resolveConflicts(serverQuotes);
    syncStatus.textContent = "✅ Synced successfully!";
  } catch (error) {
    syncStatus.textContent = "❌ Sync failed!";
    console.error("Error fetching from server:", error);
  }
}

// =============================
// Step 2: Conflict Resolution Logic
// =============================
function resolveConflicts(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

  // Merge both lists (server data takes precedence)
  const mergedQuotes = [...new Set([...serverQuotes, ...localQuotes])];

  quotes = mergedQuotes;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedQuotes));

  displayRandomQuote();

  // Notify user
  alert("Data synced successfully! Conflicts resolved (server data prioritized).");
}

// =============================
// Step 3: Auto Sync with Server
// =============================
function startAutoSync() {
  // Sync every 15 seconds (you can increase/decrease this interval)
  setInterval(fetchQuotesFromServer, 15000);
}

// =============================
// Step 4: Initialize App
// =============================
document.addEventListener('DOMContentLoaded', () => {
  displayRandomQuote();
  createAddQuoteForm();
  startAutoSync();
});

addQuoteBtn.addEventListener('click', displayRandomQuote);
