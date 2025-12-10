import { fetchCompile, fileTree, currentFolderPath } from './editor.js';

const imageList = document.getElementById('imageList');
const imageExplorer = document.getElementById("imageExplorer");

export function createFolder(fileTree, folderName) {
    if (!fileTree.children[folderName]) {
        fileTree.children[folderName] = { type: "folder", name: folderName, children: {} };
    }
    renderFileExplorer(fileTree);
}

export function getFolder(fileTree, path) {
    if (path === "root") return fileTree;

    const parts = path.split("/");
    let curr = fileTree;

    for (const part of parts) {
        if (!curr.children[part] || curr.children[part].type !== "folder") {
            return null;
        }
        curr = curr.children[part];
    }
    return curr;
}

// Render explorer recursively
export function renderFileExplorer(folder, container = imageList, path="") {
    container.innerHTML = "";
    renderTreeRecursive(folder, container, path);
}

function renderTreeRecursive(folder, container, path) {
    Object.values(folder.children).forEach(item => {
        const li = document.createElement("li");
        if (item.type === "folder") {
            li.innerHTML = `📁 <strong>${item.name}</strong>`;

            li.draggable = true;
            li.addEventListener('dragstart', e => { e.dataTransfer.setData("path", path ? `${path}/${item.name}` : item.name); e.stopPropagation(); });
            li.addEventListener('dragover', e => { e.preventDefault(); li.style.background = "#eef"; });
            li.addEventListener('dragleave', () => { li.style.background = "transparent"; });
            li.addEventListener('drop', e => {
                e.preventDefault(); li.style.background = "transparent";
                const sourcePath = e.dataTransfer.getData("path");
                moveItem(sourcePath, path ? `${path}/${item.name}` : item.name, folder);
            });

            container.appendChild(li);
            const ul = document.createElement("ul"); ul.style.marginLeft="20px"; li.appendChild(ul);
            renderTreeRecursive(item, ul, path ? `${path}/${item.name}` : item.name);
        }
        if (item.type === "file") {
            li.innerHTML = `🖼️ ${item.name}`;
            li.draggable = true;
            li.addEventListener('dragstart', e => { e.dataTransfer.setData("path", item.fullPath || item.name); e.stopPropagation(); });
            container.appendChild(li);
        }
    });
}

function moveItem(sourcePath, destFolderPath, fileTree) {
    if (destFolderPath.startsWith(sourcePath)) return;

    const srcParts = sourcePath.split("/").filter(x=>x);
    const name = srcParts[srcParts.length-1];
    const sourceParentPath = srcParts.slice(0,-1).join("/") || "root";
    const sourceParent = getFolder(fileTree, sourceParentPath);
    const destFolder = getFolder(fileTree, destFolderPath);

    if (!sourceParent || !destFolder) return;

    const item = sourceParent.children[name];
    if (!item) return;

    delete sourceParent.children[name];
    
    updatePaths(item, destFolderPath);
    destFolder.children[name] = item;
    renderFileExplorer(fileTree);
    fetchCompile();
}

function updatePaths(item, newFolderPath) {
    if (item.type === "file") {
        item.fullPath = `${newFolderPath}/${item.name}`;
    } else if (item.type === "folder") {
        Object.values(item.children).forEach(child => updatePaths(child, `${newFolderPath}/${item.name}`));
    }
}

export function initFileManager(btnShowImages, btnCreateFolder, btnUploadImages, imageFilesInput, rootDropZone) {
    btnShowImages.addEventListener("click", () => {
        imageExplorer.style.display = imageExplorer.style.display === "none" ? "block" : "none";
    });
    btnCreateFolder.addEventListener("click", () => {
        const folderName = prompt("Nom du dossier ?");
        if (!folderName) return;
        createFolder(fileTree, folderName);
    })
    btnUploadImages.addEventListener("click", () => {
        imageFilesInput.click();
    });
    imageFilesInput.addEventListener("change", (event) => {
        const files = Array.from(event.target.files);

        const targetFolder = getFolder(fileTree, currentFolderPath);
        if (!targetFolder) {
            alert("Dossier invalide");
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result;

                targetFolder.children[file.name] = {
                    type: "file",
                    name: file.name,
                    fullPath: `${currentFolderPath}/${file.name}`,
                    data: base64
                };

                renderFileExplorer(fileTree);
                fetchCompile();
            };
            reader.readAsDataURL(file);
        });
    });
    rootDropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        rootDropZone.style.background = "#eef";
    });

    rootDropZone.addEventListener("dragleave", () => {
        rootDropZone.style.background = "transparent";
    });

    rootDropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        rootDropZone.style.background = "transparent";

        const sourcePath = e.dataTransfer.getData("path");
        moveItem(sourcePath, "root", fileTree);
    });
}