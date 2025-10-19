// Retrieve quotes from localStorage or set defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", category: "Programming" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "Motivation" }
];

// Retrieve last selected category from storage
let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// Display quotes on load
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
});

//  Populate category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear existing options except “All”
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  // Add categories to dropdown
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selectedCategory) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

//  Filter quotes based on selected category
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  const quoteContainer = document.getElementById("quoteContainer");

  // Save the current category in storage
  localStorage.setItem("selectedCategory", category);

  // Filter logic
  const filteredQuotes = category === "all"
    ? quotes
    : quotes.filter(q => q.category === category);

  // Clear current quotes
  quoteContainer.innerHTML = "";

  // Render filtered quotes
  filteredQuotes.forEach(q => {
    const div = document.createElement("div");
    div.classList.add("quote");
    div.innerHTML = `
      <p>"${q.text}"</p>
      <p><strong>- ${q.author}</strong></p>
      <p><em>Category: ${q.category}</em></p>
    `;
    quoteContainer.appendChild(div);
  });
}

//  Add a new quote and update storage
function addQuote(event) {
  event.preventDefault();

  const text = document.getElementById("quoteText").value.trim();
  const author = document.getElementById("quoteAuthor").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && author && category) {
    const newQuote = { text, author, category };
    quotes.push(newQuote);

    // Save updated quotes to localStorage
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Update dropdown categories if new
    populateCategories();

    // Refresh filtered view
    filterQuotes();

    // Clear form
    event.target.reset();
  }
}
