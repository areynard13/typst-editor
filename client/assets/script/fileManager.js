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
        console.log(curr.children)
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
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "x";
        btnDelete.classList.add("btn-delete");
        btnDelete.addEventListener("click", (e) => {
            e.stopPropagation();
            const fullPath = path ? `${path}/${item.name}` : item.name;
            deleteItem(fullPath, fileTree);
        });

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
            li.appendChild(btnDelete);
            container.appendChild(li);
            const ul = document.createElement("ul"); ul.style.marginLeft="20px"; li.appendChild(ul);
            renderTreeRecursive(item, ul, path ? `${path}/${item.name}` : item.name);
        }
        if (item.type === "file") {
            li.innerHTML = `🖼️ ${item.name}`;
            li.draggable = true;
            li.addEventListener('dragstart', e => { e.dataTransfer.setData("path", item.fullPath || item.name); e.stopPropagation(); });
            li.appendChild(btnDelete);
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

    saveFileTree();
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
    btnUploadImages.addEventListener("click", (e) => {
        e.preventDefault();
        imageFilesInput.click();
    });
    imageFilesInput.addEventListener("change", (event) => {
        event.preventDefault();
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

                saveFileTree();

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

export function loadFileTree() {
    const savedTree = localStorage.getItem('fileTree');
    if (savedTree) {
        try {
            const parsedTree = JSON.parse(savedTree);
            Object.assign(fileTree, parsedTree);
            renderFileExplorer(fileTree);
        } catch (e) {
            console.error("Failed to parse saved file tree:", e);
        }
    }
}

function deleteItem(path, fileTree) {
    const parts = path.split("/").filter(x=>x);
    const name = parts[parts.length-1];
    const parentPath = parts.slice(0,-1).join("/") || "root";
    const parent = getFolder(fileTree, parentPath);

    if (!parent) return;

    delete parent.children[name];
    saveFileTree();
    renderFileExplorer(fileTree);
    fetchCompile();
}

function saveFileTree() {
    try {
        localStorage.setItem('fileTree', JSON.stringify(fileTree));
    } catch (e) {
        console.error("Too much image, only the first ones were saved in localStorage.");
    }
}