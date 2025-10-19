// Retrieve quotes from localStorage or set default ones
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", category: "Programming" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "Motivation" }
];

// Retrieve last selected category (if any)
let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
  showRandomQuote();
});

// ========== SHOW RANDOM QUOTE ==========
function showRandomQuote() {
  const category = categoryFilter ? categoryFilter.value : "all";
  const filteredQuotes =
    category === "all"
      ? quotes
      : quotes.filter((q) => q.category === category);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category.";
    return;
  }

  // Select random quote using Math.random
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  // Display quote
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <p><strong>- ${randomQuote.author}</strong></p>
    <p><em>Category: ${randomQuote.category}</em></p>
  `;

  // Save last viewed quote to session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// ========== POPULATE CATEGORIES ==========
function populateCategories() {
  if (!categoryFilter) return;

  // Get unique categories
  const categories = [...new Set(quotes.map((q) => q.category))];

  // Clear options
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  // Add options dynamically
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

  if (text === "" || category === "") {
    alert("Please fill out both fields!");
    return;
  }

  const newQuote = {
    text,
    author: "User",
    category
  };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ========== SAVE QUOTES TO LOCAL STORAGE ==========
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
