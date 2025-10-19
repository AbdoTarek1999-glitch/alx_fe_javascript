// --- Initial Quotes Array ---
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Your time is limited, don’t waste it living someone else’s life.", category: "Inspiration" },
  { text: "If you want to achieve greatness, stop asking for permission.", category: "Success" }
];

// --- DOM Elements ---
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

// --- Function: Show a Random Quote ---
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add a new one!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Clear and dynamically create quote display
  quoteDisplay.innerHTML = '';

  const quoteText = document.createElement('p');
  quoteText.textContent = `"${randomQuote.text}"`;
  quoteText.style.fontSize = '1.5rem';
  quoteText.style.fontStyle = 'italic';

  const quoteCategory = document.createElement('p');
  quoteCategory.textContent = `— ${randomQuote.category}`;
  quoteCategory.style.color = 'gray';

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// --- Function: Dynamically Create the Add Quote Form ---
function createAddQuoteForm() {
  // Create form container
  const formContainer = document.createElement('div');
  formContainer.id = 'addQuoteForm';

  // Create input for quote text
  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.id = 'newQuoteText';
  inputText.placeholder = 'Enter a new quote';

  // Create input for quote category
  const inputCategory = document.createElement('input');
  inputCategory.type = 'text';
  inputCategory.id = 'newQuoteCategory';
  inputCategory.placeholder = 'Enter quote category';

  // Create add button
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  // Append everything to the form container
  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);

  // Add to the DOM (below the quote display)
  document.body.appendChild(formContainer);
}

// --- Function: Add a New Quote Dynamically ---
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category!");
    return;
  }

  quotes.push({ text, category });

  // Clear fields
  document.getElementById('newQuoteText').value = "";
  document.getElementById('newQuoteCategory').value = "";

  // Confirmation message
  quoteDisplay.innerHTML = `<p style="color:green;">New quote added successfully!</p>`;
}

// --- Event Listeners ---
newQuoteButton.addEventListener('click', showRandomQuote);

// --- Initialize on Page Load ---
showRandomQuote();
createAddQuoteForm();
