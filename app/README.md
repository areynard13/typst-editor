# Typst Editor
**Typst Editor** is an online editor for Typst, offering a variety of features such as images, tables, and more. It is designed to make creating and managing Typst documents simple and efficient.

## Table of Contents
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [License](#license)

## Project Structure
Here is the structure of the project:
```bash
src/
├── app
│   ├── api
│   │   └── projects
│   │       └── save        # Saving the project to the db
│   ├── dashboard           # Dashboard page
│   ├── login               # Login page
│   ├── page.tsx            # Default page (editor)
│   └── signup              # Sign up page
├── assets
│   ├── script              # Script for the editor
│   └── style
├── components
│   ├── Editor.jsx          # The editor
│   ├── Footer.jsx          # The footer use in the dashboard
│   ├── ProjectAction.jsx   # The menu of action in the dashboard
│   └── ProjectCard.jsx     # A card of each project
├── lib
│   ├── auth.config.ts
│   ├── auth.ts             # Authentification
│   └── prisma.ts
└── middleware.ts           # Middleware for route protection
```

## Features
- Real-time Typst document editing
- File and folder management directly in the browser
- Zoom functionality for better readability
- Saving in database and document export (PDF and SVG)
- Opening file from the interface
- Sharing a project to somebody else

## Prerequisites
1. Developpement
    - Node.js
    - Bun


## Installation and Setup
- Clone the repository:
```bash
git clone https://github.com/ISC-HEI/typst-editor.git
```
### Start with docker
- Verify that you are at the project root.
- Start with docker
```docker
docker compose up -d --build
```
### Local Development
- Open this repo (app)
- Create a db in postgres
- Enter the DATABASE_URL in the .env
    Here's an example
    ```dotenv
    DATABASE_URL="postgresql://user:password@db:5432/typst_db"
    ```
- Install dependencies and generate prisma
```bash
bun install
bunx auth secret
bunx prisma migrate dev
bunx prisma generate
```

- Start the api, documentation [here](../server/README.md)

## Configuration
The API url can be configured in [client/assets/script/api.js](/client/assets/script/api.js)

## License
The current License is Apache version 2.0, you can see it in the [LICENSE](../LICENSE) file.