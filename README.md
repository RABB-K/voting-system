# Voting System –  Interactive Polling System (Vanilla JavaScript)

##Overview

- A dynamic polling web app built with **HTML**, **CSS**, and **Vanilla JavaScript**.  
Allows users to create polls, add options, vote once, view live results with a bar chart, and export poll data in JSON or CSV formats. Data and voting state are saved in `localStorage` for persistence.
---

## Features

- Create a poll with a custom title.
- Add multiple voting options dynamically.
- Prevent duplicate options.
- Cast a single vote per user, disabling further votes.
- Delete unwanted options anytime.
- View live results as a list and interactive bar chart powered by Chart.js.
- Reset poll data and voting status.
- Export poll data as JSON or CSV files.
- Persist data and voting state in browser localStorage.

---

##  How It Works

- Poll data (`title` and `options`) and user vote state (`hasVotedFlag`) are stored in `localStorage`.
- On page load, data is retrieved and UI rendered accordingly.
- Adding an option updates poll state and UI, preventing duplicates.
- Voting increments the selected option’s votes and disables all vote buttons.
- Deleting options removes them from the poll and updates storage.
- The bar chart updates dynamically using Chart.js.
- Export buttons generate downloadable JSON or CSV files of poll results.

---

##  Future Enhancements

- User authentication to ensure secure voting.
- Ranked-choice or weighted voting.
- Shareable poll links for remote voting.
- Custom themes (light/dark mode).
- Poll scheduling with open/close dates.
- Mobile-friendly responsive UI.
- Notifications for poll updates.
- Enhanced validation and error handling.


