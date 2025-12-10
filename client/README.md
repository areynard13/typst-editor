# Typst online editor
**Typst Online Editor** is an online editor for Typst, offering a variety of features such as images, tables, and more. It is designed to make creating and managing Typst documents simple and efficient.

## Table of Contents
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [License](#license)

## Project Structure
Here is the structure of the project:
```bash
.
├── assets
│   ├── img
│   │   └── favicon.jpeg
│   ├── script
│   │   ├── api.js          # API communication logic
│   │   ├── editor.js       # Editor logic
│   │   ├── fileManager.js  # File and folder management logic
│   │   ├── utils.js        # Utility functions used across multiple files
│   │   └── zoom.js         # Zoom functionality logic
│   └── style
│       └── style.css
├── index.html
└── README.md
```

## Features
- Real-time Typst document editing
- File and folder management directly in the browser
- Zoom functionality for better readability
- Local saving and document export (PDF and SVG)
- Opening file from the interface

## Prerequisites
- Node.js (optional, only if you want to run a local server)
- Live Server or any other local server

## Installation and Setup
- Clone the repository:
```bash
git clone https://github.com/areynard13/typst-editor.git
```
- Open the project in VS Code or your preferred editor (client).
- Start a local server (e.g., Live Server).
- Open http://127.0.0.1:5500 in your browser to start using the editor.

## License
The current License is Apache version 2.0, you can see it in the [LICENSE](../LICENSE) file.