const form = document.getElementById('transaction-form');
const formHeading = document.getElementById('form-heading');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');

const searchInput = document.getElementById('search-input');
const filterType = document.getElementById('filter-type');
const exportBtn = document.getElementById('export-btn');
const list = document.querySelector('.transaction-list');

const balanceDisplay = document.querySelector('.total-amount');
const incomeDisplay = document.querySelector('.box.income p');
const expenseDisplay = document.querySelector('.box.expense p');

// Budget & Chart Elements
const setBudgetBtn = document.getElementById('set-budget-btn');
const budgetSpentText = document.getElementById('budget-spent');
const budgetLimitText = document.getElementById('budget-limit');
const budgetBar = document.getElementById('budget-bar');
const budgetWarning = document.getElementById('budget-warning');
const categoryBarsContainer = document.getElementById('category-bars');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let monthlyBudget = Number(localStorage.getItem('monthlyBudget')) || 10000;
let editId = null;

function updateUI() {
  list.innerHTML = '';
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotals = {};

  transactions.forEach(item => {
    if (item.type === 'income') {
      totalIncome += item.amount;
    } else {
      totalExpense += item.amount;
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    }
  });

  // Update Budget Progress Bar
  budgetSpentText.textContent = `Spent: Rs. ${totalExpense.toLocaleString()}`;
  budgetLimitText.textContent = `Limit: Rs. ${monthlyBudget.toLocaleString()}`;
  
  const percentage = monthlyBudget > 0 ? Math.min((totalExpense / monthlyBudget) * 100, 100) : 0;
  budgetBar.style.width = `${percentage}%`;

  if (totalExpense > monthlyBudget) {
    budgetBar.style.backgroundColor = 'var(--red)';
    budgetWarning.classList.remove('hidden');
  } else if (percentage >= 75) {
    budgetBar.style.backgroundColor = 'var(--warning)';
    budgetWarning.classList.add('hidden');
  } else {
    budgetBar.style.backgroundColor = 'var(--green)';
    budgetWarning.classList.add('hidden');
  }

  // Update Category Spending Breakdown
  renderCategoryChart(categoryTotals, totalExpense);

  // Filter transactions for list display
  const searchTerm = searchInput.value.toLowerCase();
  const selectedType = filterType.value;

  const filtered = transactions.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm) || 
                          item.category.toLowerCase().includes(searchTerm);
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (filtered.length === 0) {
    list.innerHTML = '<li style="text-align: center; color: #636e72; padding: 15px;">No matching transactions found.</li>';
  }

  filtered.slice().reverse().forEach(item => {
    const li = document.createElement('li');
    li.classList.add('item', item.type === 'income' ? 'plus' : 'minus');
    const sign = item.type === 'income' ? '+' : '-';

    li.innerHTML = `
      <div class="item-info">
        <span class="item-title">${item.title}</span>
        <span class="item-meta">
          <span class="badge">${item.category}</span> ${item.date}
        </span>
      </div>
      <div class="item-right">
        <span class="amount">${sign} Rs. ${item.amount.toLocaleString()}</span>
        <button class="action-btn" onclick="startEdit(${item.id})" title="Edit">✏️</button>
        <button class="action-btn" onclick="deleteTransaction(${item.id})" title="Delete">❌</button>
      </div>
    `;
    list.appendChild(li);
  });

  const balance = totalIncome - totalExpense;
  balanceDisplay.textContent = `Rs. ${balance.toLocaleString()}`;
  incomeDisplay.textContent = `+ Rs. ${totalIncome.toLocaleString()}`;
  expenseDisplay.textContent = `- Rs. ${totalExpense.toLocaleString()}`;

  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function renderCategoryChart(categoryTotals, totalExpense) {
  const categories = Object.keys(categoryTotals);
  if (categories.length === 0 || totalExpense === 0) {
    categoryBarsContainer.innerHTML = '<p class="empty-msg">Add expenses to see category breakdown.</p>';
    return;
  }

  // Sort highest spending category first
  categories.sort((a, b) => categoryTotals[b] - categoryTotals[a]);

  categoryBarsContainer.innerHTML = categories.map(cat => {
    const amt = categoryTotals[cat];
    const pct = Math.round((amt / totalExpense) * 100);
    return `
      <div class="cat-row">
        <div class="cat-label">
          <span>${cat}</span>
          <span>Rs. ${amt.toLocaleString()} (${pct}%)</span>
        </div>
        <div class="cat-track">
          <div class="cat-fill" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

// Change Monthly Budget Limit
setBudgetBtn.addEventListener('click', () => {
  const input = prompt('Enter your new monthly expense limit (Rs.):', monthlyBudget);
  const newLimit = Number(input);
  if (input !== null && newLimit > 0) {
    monthlyBudget = newLimit;
    localStorage.setItem('monthlyBudget', monthlyBudget);
    updateUI();
  }
});

// Add or Update Transaction
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (editId !== null) {
    transactions = transactions.map(item => 
      item.id === editId 
        ? {
            ...item,
            title: titleInput.value.trim(),
            amount: Number(amountInput.value),
            type: typeInput.value,
            category: categoryInput.value
          }
        : item
    );
    resetFormMode();
  } else {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const newTransaction = {
      id: Date.now(),
      title: titleInput.value.trim(),
      amount: Number(amountInput.value),
      type: typeInput.value,
      category: categoryInput.value,
      date: today
    };
    transactions.push(newTransaction);
  }

  form.reset();
  updateUI();
});

function startEdit(id) {
  const item = transactions.find(t => t.id === id);
  if (!item) return;

  editId = id;
  titleInput.value = item.title;
  amountInput.value = item.amount;
  typeInput.value = item.type;
  categoryInput.value = item.category;

  formHeading.textContent = 'Edit Transaction';
  submitBtn.textContent = 'Update Transaction';
  submitBtn.classList.add('editing');
  cancelEditBtn.classList.remove('hidden');
  titleInput.focus();
}

function resetFormMode() {
  editId = null;
  formHeading.textContent = 'Add New Transaction';
  submitBtn.textContent = 'Add Transaction';
  submitBtn.classList.remove('editing');
  cancelEditBtn.classList.add('hidden');
  form.reset();
}

cancelEditBtn.addEventListener('click', resetFormMode);

function deleteTransaction(id) {
  if (editId === id) resetFormMode();
  transactions = transactions.filter(item => item.id !== id);
  updateUI();
}

searchInput.addEventListener('input', updateUI);
filterType.addEventListener('change', updateUI);

exportBtn.addEventListener('click', () => {
  if (transactions.length === 0) return alert('No transactions to export!');
  
  let csv = 'Date,Description,Category,Type,Amount (Rs)\n';
  transactions.forEach(t => {
    csv += `"${t.date}","${t.title}","${t.category}","${t.type}",${t.amount}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'expenses.csv';
  a.click();
});

updateUI();