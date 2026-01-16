"use client";
import { useEffect, useRef } from "react";
import '../assets/style/style.css';
import * as monaco from "monaco-editor";
import { ArrowDownToLine, Bold, FolderOpen, Folders, Italic, Underline, ZoomIn, ZoomOut } from "lucide-react";

export default function Editor({ projectId, title, content, fileTree }) {
  const editorRef = useRef(null);
  const monacoInstance = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initApp = async () => {
      if (editorRef.current && !monacoInstance.current) {
        monacoInstance.current = monaco.editor.create(editorRef.current, {
          value: content || "",
          language: "pug",
          theme: "vs-light",
          automaticLayout: true,
          lineNumbers: "on",
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 10, 
          lineNumbersMinChars: 3
        });
      }

      try {
        const [EditorScript, ZoomScript, FileMgrScript] = await Promise.all([
          import("../assets/script/editor.js"),
          import("../assets/script/zoom.js"),
          import("../assets/script/fileManager.js"),
        ]);

        const btnBold = document.getElementById("btnBold");
        if (!btnBold) {
          console.warn("DOM not ready for listener");
          return;
        }

        EditorScript.initEditorListeners(
          monacoInstance.current,
          projectId,
          fileTree,
          btnBold,
          document.getElementById("btnItalic"),
          document.getElementById("btnUnderline"),
          document.getElementById("btnSave"),
          document.getElementById("btnOpen"),
          document.getElementById("fileInput"),
          document.getElementById("btnExportPdf"),
          document.getElementById("btnExportSvg")
        );

        ZoomScript.initZoom(
          document.getElementById("btnZoomIn"),
          document.getElementById("btnZoomOut")
        );

        FileMgrScript.initFileManager(
          document.getElementById("btnShowImages"),
          document.getElementById("btnCloseImages"),
          document.getElementById("btnCreateFolder"),
          document.getElementById("btnUploadImages"),
          document.getElementById("imageFilesInput"),
          document.getElementById("rootDropZone")
        );

        EditorScript.fetchCompile();

      } catch (error) {
        console.error("Erreur lors du chargement des modules :", error);
      }
    };

    initApp();

    return () => {
      if (monacoInstance.current) {
        monacoInstance.current.dispose();
        monacoInstance.current = null;
      }
    };
  }, [projectId]);;

  return (
    <div className="container-full">
      <header className="editor-header">
        <div className="header-left">
          <a className="btnReturnDashboard" href="/dashboard" title="Retour au tableau de bord">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </a>
          <div className="header-title-container">
            <span className="project-badge">Project</span>
            <h1>{title}</h1>
          </div>
        </div>

        <div className="header-right">
        </div>
      </header>
      <div className="container-app">
        <div className="editor-container">
          <nav>
            <div className="btnNavBarCategory">
              <button className="btnNavBar" id="btnSave">
                <ArrowDownToLine />
              </button>
              <button className="btnNavBar" id="btnOpen">
                <FolderOpen />
              </button>
              <input type="file" id="fileInput" accept=".typ,.txt" style={{ display: "none" }} />
            </div>

            <div className="btnNavBarCategory">
              <button id="btnBold" className="btnNavBar"><Bold /></button>
              <button id="btnItalic" className="btnNavBar"><Italic /></button>
              <button id="btnUnderline" className="btnNavBar"><Underline /></button>
            </div>

            <div className="btnNavBarCategory">
              <button className="btnNavBar" id="btnShowImages"><Folders /></button>
            </div>
          </nav>

          {/* Image explorer */}
          <div id="imageExplorer" className="image-explorer" style={{ display: "none" }}>
            <div className="ImageExplorerHeader">
              <h3>files :</h3>
              <button id="btnCloseImages">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#000" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                  <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                </svg>
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <button id="btnCreateFolder" className="btnAction" style={{ flex: 1 }}>+ Folder</button>
              <button id="btnUploadImages" className="btnAction" style={{ flex: 1 }}>+ Document</button>
            </div>
            <input type="file" id="imageFilesInput" accept="*" multiple style={{ display: "none" }} />
            <div id="rootDropZone">🏠 Root</div>
            <ul id="imageList"></ul>
          </div>

          {/* Editor */}
          <div 
            ref={editorRef} 
            id="editor-instance"
            className="editor"
            style={{height: '100vh' }} 
          />
        </div>

        <div className="separator" id="separator"></div>

        {/* Preview */}
        <div className="preview" id="preview">
          <div>
            <div className="pageBtnContainer">
              <button className="btnZoom" id="btnZoomOut">
                <ZoomOut />
              </button>
              <span id="zoomLevel">100%</span>
              <button className="btnZoom" id="btnZoomIn">
                <ZoomIn />
              </button>
              <button className="btnExport" id="btnExportPdf">Export to PDF</button>
              <button className="btnExport" id="btnExportSvg">Export to SVG</button>
            </div>
            <div id="page"><div></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
