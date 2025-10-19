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
  const addQuoteButton = document.getElementById('addQuote');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  
  // --- Function: Show a Random Quote ---
  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.textContent = "No quotes available. Add a new one!";
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    // Create elements dynamically
    quoteDisplay.innerHTML = ''; // Clear old quote
    const quoteText = document.createElement('p');
    const quoteCategory = document.createElement('p');
  
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteText.style.fontSize = "1.5rem";
    quoteText.style.fontStyle = "italic";
  
    quoteCategory.textContent = `— ${randomQuote.category}`;
    quoteCategory.style.color = "gray";
  
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  }
  
  // --- Function: Add a New Quote Dynamically ---
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
  
    if (text === "" || category === "") {
      alert("Please enter both a quote and a category!");
      return;
    }
  
    // Add new quote object
    quotes.push({ text, category });
  
    // Clear input fields
    newQuoteText.value = "";
    newQuoteCategory.value = "";
  
    // Update the DOM immediately
    quoteDisplay.innerHTML = `<p style="color:green;">New quote added successfully!</p>`;
  }
  
  // --- Event Listeners ---
  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  
  // Show a random quote on page load
  showRandomQuote();
  