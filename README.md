<div align="center">

# Typst Online Editor
<img src="https://img.shields.io/badge/language-js-yellow" />
<img src="https://img.shields.io/github/last-commit/areynard13/typst-editor" />
<img src="https://img.shields.io/github/issues/areynard13/typst-editor" />

**Typst Online Editor** is a full web-based solution for creating, editing, and compiling Typst documents.
This repository contains both the **web editor (client)** and the **compilation API (server)**.
</div>

## Project Overview

This monorepo is split into two main components:

**1. Client – Online Typst Editor**
- A browser-based editor offering:
- Real-time Typst editing
- File & folder management
- Image and table support
- PDF & SVG export
- Zoom and interface utilities

> Detailed documentation available in [client/README.md](client/README.md).

**2. Server – Typst API**
- A REST API for compiling Typst documents, supporting:
- SVG & PDF rendering
- Image handling (Base64 → temporary storage → cleanup)
- Full Typst features

> Full setup and usage in [server/README.md](server/README.md).

## Getting started
Clone the repository
```bash
git clone https://github.com/areynard13/typst-editor.git
```
Each component has its own installation and run instructions.
Refer to the corresponding README:

- `client/README.md`
- `server/README.md`

The entire stack can be deployed using Docker Compose.
```docker
docker compose up -d --build
```
## Repository structure
```bash
.
├── client/     # Web editor
│   └── README.md
├── server/     # Typst API
│   └── README.md
└── LICENSE
```

## User attention
If you start the server manually (without Docker), make sure to open **ONLY** the `client` folder when starting the Live Server.

## License
This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.