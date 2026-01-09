# Typst Online Editor
**Typst Online Editor** is an online editor for Typst, offering a variety of features such as images, tables, and more. It is designed to make creating and managing Typst documents simple and efficient.

## Table of Contents
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Known Issues](#known-issues)
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
- Live Server or any other local server (if run in without docker)

## Installation and Setup
- Clone the repository:
```bash
git clone https://github.com/areynard13/typst-editor.git
```
### Start with docker
- Verify that you are at the project root.
- Start with docker
```docker
docker compose up -d --build
```
### Local Development
- Open the project in VS Code or your preferred editor (client).
- Start a local server (e.g., Live Server).
- Open http://127.0.0.1:5500 in your browser to start using the editor.
> Then you need to start the server (API)

## Configuration
The API url can be configured in [client/assets/script/api.js](/client/assets/script/api.js)

## Known Issues
**1. File Manager Sub-Folder Limitation**:  
The File Manager currently cannot insert files directly into sub-folders. Files or folders must first be created at the project root and then manually moved into the desired sub-directory (e.g. creating lib at root before moving it into src).  
See Issue [here](https://github.com/areynard13/typst-editor/issues/1)

## License
The current License is Apache version 2.0, you can see it in the [LICENSE](../LICENSE) file.