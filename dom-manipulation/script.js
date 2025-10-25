// =============================
// Dynamic Content Generator
// =============================

// مصفوفة الاقتباسات (كل عنصر كائن فيه text و category)
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" },
  { text: "If you are working on something exciting, it will keep you motivated.", category: "Work" },
  { text: "Success is not in what you have, but who you are.", category: "Wisdom" }
];

// عناصر الـ DOM
const quoteText = document.getElementById("quote-text");
const quoteCategory = document.getElementById("quote-category");
const showQuoteBtn = document.getElementById("show-quote-btn");
const addQuoteBtn = document.getElementById("add-quote-btn");

// =============================
// عرض اقتباس عشوائي
// =============================
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteText.textContent = `"${randomQuote.text}"`;
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
}

// =============================
// إضافة اقتباس جديد
// =============================
function addQuote() {
  const newText = document.getElementById("new-quote-text").value.trim();
  const newCategory = document.getElementById("new-quote-category").value.trim();

  if (newText && newCategory) {
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    document.getElementById("new-quote-text").value = "";
    document.getElementById("new-quote-category").value = "";
    alert("✅ New quote added successfully!");
    displayRandomQuote();
  } else {
    alert("⚠️ Please enter both a quote and category.");
  }
}

// =============================
// أحداث الأزرار
// =============================
showQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// =============================
// عند تحميل الصفحة
// =============================
document.addEventListener("DOMContentLoaded", displayRandomQuote);
