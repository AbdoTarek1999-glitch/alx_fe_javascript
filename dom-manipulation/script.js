// ✅ Array of quotes
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

// ✅ Function to show a random quote (uses innerHTML)
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteText.innerHTML = `"${randomQuote.text}"`;
  quoteCategory.innerHTML = `— ${randomQuote.category}`;
}

// ✅ Function to add a new quote
function addQuote(newText, newCategory) {
  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  quoteText.innerHTML = `"${newQuote.text}"`;
  quoteCategory.innerHTML = `— ${newQuote.category}`;
}

// ✅ Function to create a form dynamically for adding quotes
function createAddQuoteForm() {
  // إنشاء عناصر النموذج
  const form = document.createElement("form");
  form.id = "add-quote-form";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter quote text";
  textInput.id = "quote-input";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";
  categoryInput.id = "category-input";

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.id = "add-quote-btn";
  addButton.textContent = "Add Quote";

  // عند الضغط على الزر
  addButton.addEventListener("click", () => {
    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newText === "" || newCategory === "") {
      alert("Please fill in both fields!");
      return;
    }

    addQuote(newText, newCategory);
    textInput.value = "";
    categoryInput.value = "";
  });

  // إضافة كل العناصر للنموذج
  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);

  // إدراج النموذج داخل الصفحة
  document.body.appendChild(form);
}

// ✅ Event listeners
newQuoteButton.addEventListener("click", showRandomQuote);

// ✅ Initialize
showRandomQuote();
createAddQuoteForm();
