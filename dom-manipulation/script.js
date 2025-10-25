// =============================
// Dynamic Quote Generator (Enhanced Version)
// With Server Sync, Categories, Conflict Resolution & Alerts
// =============================

// DOM Elements
const quoteContainer = document.getElementById('quoteContainer');
const categoryFilter = document.getElementById('categoryFilter');
const form = document.getElementById('addQuoteForm');
const notificationArea = document.getElementById('notificationArea');

// Local Storage Key
const LOCAL_STORAGE_KEY = 'quotesData';

// =============================
// Load saved quotes or defaults
// =============================
let quotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", author: "Will Rogers", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", author: "Vince Lombardi", category: "Success" }
];

// =============================
// Display a Random Quote
// =============================
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteContainer.innerHTML = "<p>No quotes available!</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteContainer.innerHTML = `
    <div id="quoteDisplay">
      <p><strong>"${randomQuote.text}"</strong></p>
      <p>— ${randomQuote.author}</p>
      <p><em>Category: ${randomQuote.category}</em></p>
    </div>
    <button id="newQuoteBtn">Show New Quote</button>
  `;

  document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);
}

// =============================
// Add a New Quote
// =============================
function addQuote(event) {
  event.preventDefault();

  const text = document.getElementById('quoteText').value.trim();
  const author = document.getElementById('quoteAuthor').value.trim();
  const category = document.getElementById('quoteCategory').value.trim();

  if (!text || !author || !category) {
    showNotification("⚠️ Please fill in all fields.", "error");
    return;
  }

  const newQuote = { text, author, category };
  quotes.push(newQuote);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));

  // Update category filter
  if (![...categoryFilter.options].some(opt => opt.value === category)) {
    const newOption = document.createElement('option');
    newOption.value = category;
    newOption.textContent = category;
    categoryFilter.appendChild(newOption);
  }

  form.reset();
  filterQuotes();
  showNotification("✅ Quote added successfully!", "success");
  syncQuotes();
}

// =============================
// Filter Quotes by Category
// =============================
function filterQuotes() {
  const selectedCategory = categoryFilter.value;

  let filtered = quotes;
  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    quoteContainer.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteContainer.innerHTML = `
    <div id="quoteDisplay">
      <p><strong>"${randomQuote.text}"</strong></p>
      <p>— ${randomQuote.author}</p>
      <p><em>Category: ${randomQuote.category}</em></p>
    </div>
    <button id="newQuoteBtn">Show New Quote</button>
  `;

  document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);
}

// =============================
// Fetch Quotes from Server (GET)
// =============================
async function fetchQuotesFromServer() {
  try {
    showNotification("🔄 Fetching quotes from server...");
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      author: "Server",
      category: "Imported"
    }));

    resolveConflicts(serverQuotes);
    showNotification("✅ Quotes fetched & merged from server!", "success");
  } catch (error) {
    showNotification("❌ Failed to fetch quotes from server!", "error");
  }
}

// =============================
// Upload Quotes to Server (POST)
// =============================
async function uploadQuotesToServer() {
  try {
    showNotification("📤 Uploading quotes to server...");
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quotes })
    });

    showNotification("✅ Quotes uploaded successfully!", "success");
  } catch (error) {
    showNotification("❌ Upload failed!", "error");
  }
}

// =============================
// Conflict Resolution
// =============================
function resolveConflicts(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  const merged = [...serverQuotes, ...localQuotes].filter(
    (quote, index, self) =>
      index === self.findIndex(q => q.text === quote.text)
  );
  quotes = merged;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
  displayRandomQuote();
}

// =============================
// Sync Function (Main)
// =============================
async function syncQuotes() {
  showNotification("🔁 Syncing quotes with server...");
  await uploadQuotesToServer();
  await fetchQuotesFromServer();
  showNotification("✅ Quotes synced with server!", "success");
  alert("Quotes synced with server!");
}

// =============================
// Helper: Show Notification
// =============================
function showNotification(message, type = "info") {
  notificationArea.textContent = message;
  notificationArea.style.color = type === "error" ? "red" : "green";
}

// =============================
// Populate Categories Dynamically
// =============================
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// =============================
// Initialize App
// =============================
window.onload = function() {
  populateCategories();
  displayRandomQuote();
  form.addEventListener('submit', addQuote);
  categoryFilter.addEventListener('change', filterQuotes);
};
