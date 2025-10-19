// --- Keys for storage ---
const LOCAL_KEY = 'dynamicQuoteGenerator_quotes_v1';
const SESSION_KEY_LAST_INDEX = 'dynamicQuoteGenerator_lastIndex_v1';

// --- Default quotes (used only if localStorage is empty) ---
const defaultQuotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Your time is limited, don’t waste it living someone else’s life.", category: "Inspiration" },
  { text: "If you want to achieve greatness, stop asking for permission.", category: "Success" }
];

// --- App State ---
let quotes = [];

// --- DOM Elements ---
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const showAllButton = document.getElementById('showAll');
const importFileInput = document.getElementById('importFile');
const importBtn = document.getElementById('importBtn');
const exportBtn = document.getElementById('exportBtn');
const messageEl = document.getElementById('message');

// --- Storage helpers ---
function saveQuotes() {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(quotes));
    showMessage('Quotes saved to local storage.');
  } catch (err) {
    console.error('Failed to save quotes:', err);
    showMessage('Error: could not save to local storage.');
  }
}

function loadQuotesFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return false;
    // Basic validation of items
    const ok = parsed.every(q => q && typeof q.text === 'string' && typeof q.category === 'string');
    if (!ok) return false;
    quotes = parsed;
    return true;
  } catch (err) {
    console.warn('Could not parse saved quotes:', err);
    return false;
  }
}

// --- Utility: show feedback messages briefly ---
let msgTimeout = null;
function showMessage(text, timeout = 3000) {
  clearTimeout(msgTimeout);
  messageEl.textContent = text;
  msgTimeout = setTimeout(() => { messageEl.textContent = ''; }, timeout);
}

// --- Display helpers ---
function clearQuoteDisplay() {
  quoteDisplay.innerHTML = '';
}

function renderQuoteObject(quoteObj) {
  const container = document.createElement('div');

  const quoteText = document.createElement('p');
  quoteText.textContent = `"${quoteObj.text}"`;
  quoteText.style.fontSize = '1.25rem';
  quoteText.style.fontStyle = 'italic';
  quoteText.style.margin = '0.25rem 0';

  const quoteCategory = document.createElement('p');
  quoteCategory.textContent = `— ${quoteObj.category}`;
  quoteCategory.style.color = 'gray';
  quoteCategory.style.margin = '0 0 0.5rem 0';

  container.appendChild(quoteText);
  container.appendChild(quoteCategory);

  return container;
}

// --- Function: Show a Random Quote ---
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add a new one!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  clearQuoteDisplay();
  quoteDisplay.appendChild(renderQuoteObject(randomQuote));

  // store last shown index in session storage (session-based)
  try {
    sessionStorage.setItem(SESSION_KEY_LAST_INDEX, String(randomIndex));
  } catch (err) {
    console.warn('sessionStorage not available:', err);
  }
}

// --- Function: Show All Quotes (helpful for verification) ---
function showAllQuotes() {
  clearQuoteDisplay();
  if (quotes.length === 0) {
    quoteDisplay.textContent = 'No quotes to display.';
    return;
  }

  const list = document.createElement('div');
  quotes.forEach((q, idx) => {
    const item = renderQuoteObject(q);
    // small meta
    const meta = document.createElement('div');
    meta.style.fontSize = '0.8rem';
    meta.style.color = '#666';
    meta.textContent = `Index: ${idx}`;
    item.appendChild(meta);

    item.style.borderBottom = '1px solid #eee';
    item.style.padding = '10px 0';
    list.appendChild(item);
  });
  quoteDisplay.appendChild(list);
}

// --- Function: Dynamically Create the Add Quote Form ---
function createAddQuoteForm() {
  // If form already exists, skip
  if (document.getElementById('addQuoteForm')) return;

  const formContainer = document.createElement('div');
  formContainer.id = 'addQuoteForm';
  formContainer.style.marginTop = '18px';

  // Create input for quote text
  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.id = 'newQuoteText';
  inputText.placeholder = 'Enter a new quote';
  inputText.style.width = '40%';

  // Create input for quote category
  const inputCategory = document.createElement('input');
  inputCategory.type = 'text';
  inputCategory.id = 'newQuoteCategory';
  inputCategory.placeholder = 'Enter quote category';
  inputCategory.style.width = '20%';

  // Create add button
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  // Append everything to the form container
  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);

  // Add to the DOM (below the controls)
  const controls = document.getElementById('controls') || document.body;
  controls.insertAdjacentElement('afterend', formContainer);
}

// --- Function: Add a New Quote Dynamically ---
function addQuote() {
  const textEl = document.getElementById('newQuoteText');
  const catEl = document.getElementById('newQuoteCategory');

  if (!textEl || !catEl) {
    alert('Add-quote form not found.');
    return;
  }

  const text = textEl.value.trim();
  const category = catEl.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category!");
    return;
  }

  const newQ = { text, category };
  quotes.push(newQ);
  saveQuotes();

  // Provide immediate feedback and clear inputs
  showMessage('New quote added.');
  textEl.value = '';
  catEl.value = '';
}

// --- JSON Export ---
function exportQuotesToJson() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const filename = `quotes_export_${now.toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showMessage('Export started — check your downloads.');
  } catch (err) {
    console.error('Export failed', err);
    showMessage('Export failed.');
  }
}

// --- JSON Import (from input file element) ---
function importFromJsonFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (!Array.isArray(parsed)) {
          reject(new Error('Imported JSON must be an array of quote objects.'));
          return;
        }
        // Validate objects
        const validItems = parsed.filter(item => item && typeof item.text === 'string' && typeof item.category === 'string');
        if (validItems.length === 0) {
          reject(new Error('No valid quote objects found in the file.'));
          return;
        }
        // Append valid items
        quotes.push(...validItems);
        saveQuotes();
        resolve({ imported: validItems.length });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = function(err) {
      reject(err);
    };
    reader.readAsText(file);
  });
}

// --- Bind UI events ---
newQuoteButton.addEventListener('click', showRandomQuote);
showAllButton.addEventListener('click', showAllQuotes);
exportBtn.addEventListener('click', exportQuotesToJson);
importBtn.addEventListener('click', () => {
  const file = importFileInput.files && importFileInput.files[0];
  if (!file) {
    alert('Please choose a JSON file first (use the file input).');
    return;
  }
  importFromJsonFile(file)
    .then(result => {
      showMessage(`Imported ${result.imported} quotes.`);
      // Optionally show all to confirm
      showAllQuotes();
    })
    .catch(err => {
      console.error('Import error:', err);
      alert('Import failed: ' + (err.message || String(err)));
    });
});

// Also allow drag-and-drop or direct change on file input (optional)
importFileInput.addEventListener('change', (e) => {
  // no auto-import here; user must click Import button to confirm
});

// --- Initialization on load ---
(function init() {
  const loaded = loadQuotesFromLocalStorage();
  if (!loaded) {
    // fallback to default set
    quotes = defaultQuotes.slice();
    saveQuotes(); // persist defaults for next time
  }
  createAddQuoteForm();

  // If session stored a last index, try to show that quote
  try {
    const last = sessionStorage.getItem(SESSION_KEY_LAST_INDEX);
    if (last !== null) {
      const idx = Number(last);
      if (!Number.isNaN(idx) && quotes[idx]) {
        clearQuoteDisplay();
        quoteDisplay.appendChild(renderQuoteObject(quotes[idx]));
      } else {
        // show a random one
        showRandomQuote();
      }
    } else {
      showRandomQuote();
    }
  } catch (err) {
    // sessionStorage unavailable, just show random
    showRandomQuote();
  }
})();
