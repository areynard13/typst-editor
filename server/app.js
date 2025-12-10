const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { NodeCompiler } = require('@myriaddreamin/typst-ts-node-compiler');

const $typst = NodeCompiler.create({ inputs: { 'X': 'u' } });
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.text({ limit: '50mb', type: '*/*' }));

// ---------- Helper functions ----------

// Write all images from imgPaths and return sets of created files and directories
function writeImages(imgPaths = {}) {
  const createdFiles = new Set();
  const createdDirs = new Set();

  for (const p in imgPaths) {
    const base64Img = imgPaths[p].split(',')[1];
    const filePath = p;
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      createdDirs.add(dir);
    }

    fs.writeFileSync(filePath, Buffer.from(base64Img, 'base64'));
    createdFiles.add(filePath);
  }

  return { createdFiles, createdDirs };
}

// Delete temporary files and empty directories
function cleanupTemp(createdFiles, createdDirs) {
  for (const file of createdFiles) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }

  // Remove directories from longest path to shortest
  const sortedDirs = Array.from(createdDirs).sort((a, b) => b.length - a.length);
  for (const dir of sortedDirs) {
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
    }
  }
}

// ---------- Routes ----------

// Render Typst source to SVG
app.post('/render', (req, res) => {
  let body;
  try {
    body = JSON.parse(req.body);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { source, images: imgPaths } = body;
  if (!source) return res.status(400).json({ error: 'Missing source' });

  const { createdFiles, createdDirs } = writeImages(imgPaths);

  try {
    const svg = $typst.svg({ inputs: { 'Y': 'v' }, mainFileContent: source });
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Compilation failed', details: err.code });
  } finally {
    cleanupTemp(createdFiles, createdDirs);
  }
});

// Export Typst source to PDF
app.post('/export/pdf', (req, res) => {
  let body;
  try {
    body = JSON.parse(req.body);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { source, images: imgPaths } = body;
  if (!source) return res.status(400).json({ error: 'Missing source' });

  const { createdFiles, createdDirs } = writeImages(imgPaths);

  try {
    const pdfBuffer = $typst.pdf({ mainFileContent: source });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  } finally {
    cleanupTemp(createdFiles, createdDirs);
  }
});

app.listen(PORT, () => console.log(`Typst API server running on http://localhost:${PORT}`));
