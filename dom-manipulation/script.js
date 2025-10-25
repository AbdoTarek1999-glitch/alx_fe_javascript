// ✅ Array of quotes (each quote is an object with text and category)
const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Don’t watch the clock; do what it does. Keep going.", category: "Productivity" },
  { text: "Your limitation—it’s only your imagination.", category: "Motivation" },
  { text: "Hard work beats talent when talent doesn’t work hard.", category: "Discipline" }
];

// ✅ Select DOM elements
const quoteText = document.getElementById("quote-text");
const quoteCategory = document.getElementById("quote-category");
const newQuoteButton = document.getElementById("new-quote-btn");
const addQuoteButton = document.getElementById("add-quote-btn");
const quoteInput = document.getElementById("quote-input");
const categoryInput = document.getElementById("category-input");

// ✅ Function to display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteText.textContent = `"${randomQuote.text}"`;
  quoteCategory.textContent = `— ${randomQuote.category}`;
}

// ✅ Function to add a new quote
function addQuote() {
  const newText = quoteInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add the new quote to the array
  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);

  // Clear inputs
  quoteInput.value = "";
  categoryInput.value = "";

  // Update the DOM to show the newly added quote
  quoteText.textContent = `"${newQuote.text}"`;
  quoteCategory.textContent = `— ${newQuote.category}`;
}

// ✅ Event listeners
newQuoteButton.addEventListener("click", displayRandomQuote);
addQuoteButton.addEventListener("click", addQuote);

// ✅ Display a quote by default on page load
displayRandomQuote();
