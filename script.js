
// Select DOM elements
const pollNameInput = document.getElementById("pollName");
const newOptionInput = document.getElementById("newOption");
const addOptionBtn = document.getElementById("addOptionBtn");
const optionsList = document.getElementById("optionsList");
const resultsList = document.getElementById("resultsList");
const resetBtn = document.getElementById("resetBtn");
const exportJsonBtn = document.getElementById("exportJsonBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const pollChartCtx = document.getElementById("pollChart").getContext("2d");

let poll = {
  title: "",
  options: [], // Each option: { name: string, votes: number }
};

let hasVotedFlag = false;
let pollChart;

// Load poll from localStorage on page load
window.onload = () => {
  const savedPoll = localStorage.getItem("pollData");
  const savedVoted = localStorage.getItem("hasVoted");

  if (savedPoll) {
    poll = JSON.parse(savedPoll);
    pollNameInput.value = poll.title;
  }
  hasVotedFlag = savedVoted === "true";

  renderOptions();
  renderResults();
  updateChart();
  toggleVotingButtons();
};

// Save poll data and vote status to localStorage
function savePoll() {
  localStorage.setItem("pollData", JSON.stringify(poll));
  localStorage.setItem("hasVoted", hasVotedFlag ? "true" : "false");
}

// Render poll options with vote & delete buttons
function renderOptions() {
  optionsList.innerHTML = "";
  const disableVote = hasVotedFlag;

  poll.options.forEach((option, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "option-item";

    optionDiv.innerHTML = `
      <span>${option.name}</span>
      <button class="vote-btn" data-index="${index}" ${disableVote ? "disabled" : ""}>Vote</button>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;

    optionsList.appendChild(optionDiv);
  });
}

// Render vote counts in the results list
function renderResults() {
  resultsList.innerHTML = "";
  poll.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = `${option.name}: ${option.votes} vote${option.votes !== 1 ? "s" : ""}`;
    resultsList.appendChild(li);
  });
}

// Update Chart.js bar chart with current votes
function updateChart() {
  const labels = poll.options.map(opt => opt.name);
  const data = poll.options.map(opt => opt.votes);

  if (pollChart) {
    pollChart.data.labels = labels;
    pollChart.data.datasets[0].data = data;
    pollChart.update();
  } else {
    pollChart = new Chart(pollChartCtx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Votes",
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            precision: 0
          }
        }
      }
    });
  }
}

// Enable or disable vote buttons based on voting status
function toggleVotingButtons() {
  const voteButtons = document.querySelectorAll(".vote-btn");
  voteButtons.forEach(btn => btn.disabled = hasVotedFlag);
}

// Add new option
addOptionBtn.onclick = () => {
  const optionName = newOptionInput.value.trim();
  const pollTitle = pollNameInput.value.trim();

  if (!pollTitle) {
    alert("Please enter a poll title.");
    pollNameInput.focus();
    return;
  }

  if (!optionName) {
    alert("Please enter an option name.");
    newOptionInput.focus();
    return;
  }

  // Update poll title and add new option with 0 votes
  poll.title = pollTitle;

  // Prevent duplicates
  if (poll.options.some(opt => opt.name.toLowerCase() === optionName.toLowerCase())) {
    alert(`Option "${optionName}" already exists.`);
    return;
  }

  poll.options.push({ name: optionName, votes: 0 });
  newOptionInput.value = "";
  savePoll();
  renderOptions();
  renderResults();
  updateChart();
};

// Listen for clicks on optionsList (event delegation for vote and delete)
optionsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("vote-btn")) {
    voteOption(parseInt(e.target.dataset.index));
  } else if (e.target.classList.contains("delete-btn")) {
    deleteOption(parseInt(e.target.dataset.index));
  }
});

// Vote for an option (only once)
function voteOption(index) {
  if (hasVotedFlag) {
    alert("You have already voted.");
    return;
  }
  poll.options[index].votes++;
  hasVotedFlag = true;
  savePoll();
  renderOptions();
  renderResults();
  updateChart();
  toggleVotingButtons();
}

// Delete an option from poll
function deleteOption(index) {
  if (confirm(`Delete option "${poll.options[index].name}"?`)) {
    poll.options.splice(index, 1);
    savePoll();
    renderOptions();
    renderResults();
    updateChart();
  }
}

// Reset entire poll and voting status
resetBtn.onclick = () => {
  if (confirm("Are you sure you want to reset the poll?")) {
    poll = { title: "", options: [] };
    hasVotedFlag = false;
    pollNameInput.value = "";
    newOptionInput.value = "";
    savePoll();
    renderOptions();
    renderResults();
    updateChart();
    toggleVotingButtons();
  }
};

// Export poll results as JSON file
exportJsonBtn.onclick = () => {
  const dataStr = JSON.stringify(poll, null, 2);
  downloadFile(dataStr, "poll_results.json", "application/json");
};

// Export poll results as CSV file
exportCsvBtn.onclick = () => {
  if (poll.options.length === 0) {
    alert("No data to export.");
    return;
  }

  // Prepare CSV header and rows
  let csvContent = "Option,Votes\n";
  poll.options.forEach(opt => {
    csvContent += `"${opt.name.replace(/"/g, '""')}",${opt.votes}\n`;
  });

  downloadFile(csvContent, "poll_results.csv", "text/csv");
};

// Utility: Download text as file
function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
}
