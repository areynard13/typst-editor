import { fetchCompile, fileTree, currentProjectId } from './editor.js';

const imageList = document.getElementById('imageList');
const imageExplorer = document.getElementById("imageExplorer");
let selectedFolderPath = "root";

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
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "x";
        btnDelete.classList.add("btn-delete");
        btnDelete.onclick = (e) => {
            e.stopPropagation();
            const fullPath = path ? `${path}/${item.name}` : item.name;
            deleteItem(fullPath, fileTree);
        };

        if (item.type === "folder") {
            const currentPath = path ? `${path}/${item.name}` : item.name;
            li.innerHTML = `📁 <strong>${item.name}</strong>`;
            li.classList.add("folder-item");
            
            li.addEventListener("click", (e) => {
                e.stopPropagation();
                document.querySelectorAll('.folder-item').forEach(el => el.classList.remove('selected-folder'));
                li.classList.add('selected-folder');
                selectedFolderPath = currentPath;
            });

            li.draggable = true;
            li.addEventListener('dragstart', e => { e.dataTransfer.setData("path", currentPath); e.stopPropagation(); });
            li.addEventListener('dragover', e => { e.preventDefault(); li.style.background = "#eef"; });
            li.addEventListener('dragleave', () => { li.style.background = "transparent"; });
            li.addEventListener('drop', e => {
                e.preventDefault(); 
                li.style.background = "transparent";
                const sourcePath = e.dataTransfer.getData("path");
                moveItem(sourcePath, currentPath, fileTree);
            });
            li.appendChild(btnDelete);
            container.appendChild(li);
            const ul = document.createElement("ul"); 
            ul.style.marginLeft="20px"; 
            li.appendChild(ul);
            renderTreeRecursive(item, ul, currentPath);

        } else if (item.type === "file") {
            let icon = getIcon(item.name)
            li.innerHTML = `${icon} ${item.name}`;
            li.draggable = true;
            li.addEventListener('dragstart', e => { 
                const filePath = path ? `${path}/${item.name}` : item.name;
                e.dataTransfer.setData("path", filePath); 
                e.stopPropagation(); 
            });
            li.appendChild(btnDelete);
            container.appendChild(li);
        }
    });
}

async function moveItem(sourcePath, destFolderPath, fileTree) {
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

    await saveFileTree();
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
    rootDropZone.addEventListener("click", () => {
        document.querySelectorAll('.folder-item').forEach(el => el.classList.remove('selected-folder'));
        selectedFolderPath = "root";
    });
    btnCreateFolder.addEventListener("click", async () => {
        const folderName = prompt(`Create new folder in ${selectedFolderPath}:`);
        if (!folderName) return;

        const targetFolder = getFolder(fileTree, selectedFolderPath);
        if (targetFolder) {
            if (!targetFolder.children[folderName]) {
                targetFolder.children[folderName] = { type: "folder", name: folderName, children: {} };
                renderFileExplorer(fileTree);
                await saveFileTree();
                selectedFolderPath="root"
            }
        }
    });
    btnUploadImages.addEventListener("click", (e) => {
        e.preventDefault();
        imageFilesInput.click();
    });
    imageFilesInput.addEventListener("change", (event) => {
        const files = Array.from(event.target.files);
        const targetFolder = getFolder(fileTree, selectedFolderPath);
        
        if (!targetFolder) {
            alert("Invalid target folder");
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                targetFolder.children[file.name] = {
                    type: "file",
                    name: file.name,
                    fullPath: selectedFolderPath === "root" ? file.name : `${selectedFolderPath}/${file.name}`,
                    data: e.target.result
                };
                await saveFileTree();
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

async function deleteItem(path, fileTree) {
    document.querySelectorAll('.folder-item').forEach(el => el.classList.remove('selected-folder'));
    const parts = path.split("/").filter(x=>x);
    const name = parts[parts.length-1];
    const parentPath = parts.slice(0,-1).join("/") || "root";
    const parent = getFolder(fileTree, parentPath);

    if (!parent) return;

    delete parent.children[name];
    await saveFileTree();
    renderFileExplorer(fileTree);
    fetchCompile();
    selectedFolderPath = "root";
}

async function saveFileTree() {
    if (!currentProjectId) return;

    const currentFileTree = fileTree;

    try {
        await fetch('/api/projects/save', {
            method: 'POST',
            body: JSON.stringify({
                id: currentProjectId,
                fileTree: currentFileTree
            })
        });
        console.log("Projet sauvegardé...");
    } catch (err) {
        console.error("Erreur sauvegarde:", err);
    }
}

function getIcon(filename) {
    const parts = filename.split(".");
    const extension = parts[parts.length - 1];
    const ext = extension.toLowerCase();

    if (["json"].includes(ext)) return "📜";
    if (["typ"].includes(ext)) return "📘";
    if (["tmtheme"].includes(ext)) return "📔";
    if (["py", "sh", "js"].includes(ext)) return "📕";
    if (["jpg", "jpeg", "svg", "png"].includes(ext)) return "🖼️";
    
    return "❓";
}
