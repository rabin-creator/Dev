# 🚀 Git Branch & Merge Sandbox

An interactive, terminal-style Git simulator built using **HTML, CSS, and JavaScript**. This project helps beginners understand how Git works by visualizing commits, branches, merges, and HEAD movements in a live commit graph.

## ✨ Features

- **Live Commit Graph:** Visualize Git commits and their relationships.
- **Branch Management:** Create and switch between different branches.
- **Commit Creation:** Create new commits with custom messages.
- **Checkout:** Switch between branches or individual commits.
- **Merge Operations:** Merge one branch into another with a visual merge commit.
- **Reset HEAD:** Move the current HEAD to the previous commit.
- **Interactive Terminal:** Execute Git-like commands directly in the browser.
- **Quick Actions:** Use shortcut buttons for common Git operations.
- **Commit Inspector:** View commit hashes, branches, parent commits, and messages.
- **Dynamic UI:** Real-time updates of branches, commits, and the commit graph.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- SVG (for commit graph visualization)

## 📂 Project Structure

```text
Git-Branch-Merge-Sandbox/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rabin-creator/Dev.git
```

### 2. Open the Project

Navigate to the project folder:

```bash
cd Git-Branch-Merge-Sandbox
```

### 3. Run the Project

Open `index.html` in your browser or use the **Live Server** extension in VS Code.

## 💻 Supported Commands

| Command | Description |
|---|---|
| `help` | Display available commands |
| `git init` | Initialize/reset the simulator |
| `git commit -m "message"` | Create a new commit |
| `git branch feature` | Create a new branch |
| `git checkout main` | Switch to a branch |
| `git checkout -b dev` | Create and switch to a new branch |
| `git checkout HASH` | Checkout a specific commit |
| `git merge feature` | Merge a branch into the current branch |
| `git reset --hard HEAD~1` | Move HEAD to the previous commit |

## 🎯 Project Purpose

The main goal of this project is to make Git concepts easier to understand through interactive visualization rather than memorizing commands.

It provides a beginner-friendly environment to experiment with Git branching, committing, merging, and navigating commit history.

## 🚧 Future Improvements

- Add commit deletion and branch deletion.
- Add support for `git log`.
- Improve mobile responsiveness.
- Add conflict simulation during merging.
- Add commit history navigation.
- Add animations for branch and merge operations.

## 👨‍💻 Author

**Rabin Kunar DC**

Computer Engineering Student | Learning Web Development

---

⭐ If you find this project useful, consider giving it a star!


![Project Screenshot](./Screenshot 2026)