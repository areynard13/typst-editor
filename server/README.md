# Typst API
**Typst API** is an API for compiling and exporting Typst documents. It supports images and all core Typst features.

## Table of Contents
- [Features](#features)
- [Installation and Setup](#installation-and-setup)
    - [Clone the repository](#clone-the-repository)
    - [Build ans run with Docker](#build-and-run-with-docker)
- [Usage](#usage)
    - [Payload example](#payload-example)
- [Images feature](#images-feature)
- [License](#license)

## Features
- Compile Typst documents to SVG
- Compile Typst documents to PDF
- Support for images in documents
- Full Typst functionality available through API

## Installation and Setup
### Clone the repository
```bash
git clone https://github.com/areynard13/typst-editor.git
cd typst-editor/server
```
### Build and run with Docker
```docker
docker build -t typst-api:1 .  # Build the Docker image
docker run -p 3000:3000 -d typst-api:1  # Run the container
```
Once running, the API will be accessible at http://localhost:3000.

## Usage
You can send requests to the API to compile Typst documents. Here's the endpoints:

| Endpoint       | Method | Body | Description |
|----------------|--------|------|-------------|
| /render        | POST   |   `payload`   | Renders a Typst document to SVG |
| /export/pdf    | POST   | `payload` | Exports a Typst document to PDF |

### Payload example
```json
{
  "source": "=Heading1",
  "imgPaths": {
    "/assets/logo.png": "base64_string"
  }
}
```
`source` → The Typst document content as a string.  
`imgPaths` → Optional object mapping image paths to Base64-encoded images.

## Images feature
When rendering images in a Typst document, the API handles them in the following way:

1. **Receive Base64 Image** – The image is sent as a Base64-encoded string in the imgPaths payload.
2. **Temporary File Creation** – The API creates a temporary image file from the Base64 data.
3. **Document Compilation** – Typst generates the SVG or PDF, including the temporary image.
4. **Cleanup** – After compilation, the temporary image file and its folder are automatically deleted to save storage and keep the server clean.

This process ensures that images are included in the document without leaving unnecessary files on the server.

## License
The current License is Apache version 2.0, you can see it in the [LICENSE](../LICENSE) file.