// ========== INITIAL DATA ==========
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "Inspiration", updatedAt: Date.now() },
  { id: 2, text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", category: "Programming", updatedAt: Date.now() },
  { id: 3, text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "Motivation", updatedAt: Date.now() }
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notificationArea = document.getElementById("notificationArea");

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
  showRandomQuote();
  startAutoSync();
});

// ========== SHOW RANDOM QUOTE ==========
function showRandomQuote() {
  const category = categoryFilter ? categoryFilter.value : "all";
  const filteredQuotes =
    category === "all" ? quotes : quotes.filter((q) => q.category === category);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <p><strong>- ${randomQuote.author}</strong></p>
    <p><em>Category: ${randomQuote.category}</em></p>
  `;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// ========== POPULATE CATEGORIES ==========
function populateCategories() {
  if (!categoryFilter) return;

  const categories = [...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selectedCategory) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

// ========== FILTER QUOTES ==========
function filterQuotes() {
  const category = categoryFilter.value;
  localStorage.setItem("selectedCategory", category);
  showRandomQuote();
}

// ========== ADD NEW QUOTE ==========
function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please fill out both fields!");
    return;
  }

  const newQuote = {
    id: Date.now(),
    text,
    author: "User",
    category,
    updatedAt: Date.now()
  };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  notify("✅ Quote added locally! Will sync to server soon.");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ========== SAVE TO LOCAL STORAGE ==========
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ========== JSON EXPORT ==========
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ========== JSON IMPORT ==========
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format!");
      }
    } catch (error) {
      alert("Error reading JSON file!");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ========== SERVER SYNC (SIMULATION) ==========
async function syncWithServer() {
  try {
    // Simulate fetch from server
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverData = await response.json();

    // Convert server posts into quote-like objects
    const serverQuotes = serverData.map((p) => ({
      id: p.id,
      text: p.title,
      author: "Server",
      category: "ServerSync",
      updatedAt: Date.now()
    }));

    // Resolve conflicts: if same ID, prefer server version
    const merged = [...quotes];
    serverQuotes.forEach((srv) => {
      const index = merged.findIndex((q) => q.id === srv.id);
      if (index >= 0) {
        if (srv.updatedAt > merged[index].updatedAt) {
          merged[index] = srv;
          notify(`⚠️ Conflict resolved: Server quote #${srv.id} replaced local version.`);
        }
      } else {
        merged.push(srv);
      }
    });

    quotes = merged;
    saveQuotes();
    populateCategories();
    filterQuotes();
    notify("🔄 Synced with server successfully.");
  } catch (err) {
    console.error("Sync failed:", err);
    notify("❌ Server sync failed.");
  }
}

// ========== PERIODIC SYNC ==========
function startAutoSync() {
  syncWithServer();
  setInterval(syncWithServer, 30000); // every 30 seconds
}

// ========== NOTIFICATION HANDLER ==========
function notify(message) {
  if (!notificationArea) return;
  const div = document.createElement("div");
  div.textContent = message;
  div.style.background = "#e3f2fd";
  div.style.border = "1px solid #2196f3";
  div.style.padding = "10px";
  div.style.margin = "10px 0";
  div.style.borderRadius = "5px";
  notificationArea.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}
