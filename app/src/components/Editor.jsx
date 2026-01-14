"use client";
import { useEffect } from "react";
import '../assets/style/style.css';


export default function Editor({projectId, title, content, fileTree}) {
  useEffect(() => {
    import("../assets/script/editor.js").then(Editor => {
      import("../assets/script/zoom.js").then(Zoom => {
        import("../assets/script/fileManager.js").then(FileMgr => {
          Editor.initEditorListeners(
            projectId,
            fileTree,
            content,
            document.getElementById("btnBold"),
            document.getElementById("btnItalic"),
            document.getElementById("btnUnderline"),
            document.getElementById("btnSave"),
            document.getElementById("btnOpen"),
            document.getElementById("fileInput"),
            document.getElementById("btnExportPdf"),
            document.getElementById("btnExportSvg")
          );

          Zoom.initZoom(
            document.getElementById("btnZoomIn"),
            document.getElementById("btnZoomOut")
          );

          FileMgr.initFileManager(
            document.getElementById("btnShowImages"),
            document.getElementById("btnCreateFolder"),
            document.getElementById("btnUploadImages"),
            document.getElementById("imageFilesInput"),
            document.getElementById("rootDropZone")
          );

          FileMgr.loadFileTree();

          Editor.fetchCompile();
          Editor.updateLineNumbers();
        });
      });
    });
  }, [projectId]);

  return (
    <div className="container">
      <div className="editor-container">
        <nav>
          <div className="btnNavBarCategory">
            <button className="btnNavBar" id="btnSave">
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="btnNavBar" id="btnOpen">
              <svg className="iconOpen" width="20px" height="20px" fill="#000" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <g fillRule="evenodd" transform="translate(42.667 42.667)">
                  <path d="M178.0832,42.6666667 L221.594,77.0716667 L191.217,107.448667 L163.24992,85.3333333 L42.6666667,85.3333333 L42.6666667,296.106667 L82.0209067,170.666667 L341.333333,170.666667 L341.333,170.665667 L384,170.665667 L437.333333,170.666667 L372.583253,384 L0,384 L0,42.6666667 L178.0832,42.6666667 Z M379.79136,213.333333 L113.354027,213.333333 L73.1874133,341.333333 L340.95808,341.333333 L379.79136,213.333333 Z" />
                  <path d="M384,0 L384,149.333333 L341.333333,149.333333 L341.332777,72.836 L264.836777,149.332777 L204.496777,149.333333 L311.162777,42.666 L234.666667,42.6666667 L234.666667,0 L384,0 Z" />
                </g>
              </svg>
            </button>
            <input type="file" id="fileInput" accept=".typ,.txt" style={{ display: "none" }} />
          </div>

          <div className="btnNavBarCategory">
            <button id="btnBold" className="btnNavBar"><strong>B</strong></button>
            <button id="btnItalic" className="btnNavBar"><i>I</i></button>
            <button id="btnUnderline" className="btnNavBar"><u>U</u></button>
          </div>

          <div className="btnNavBarCategory">
            <button className="btnNavBar" id="btnShowImages">📁</button>
          </div>
        </nav>

        {/* Image explorer */}
        <div id="imageExplorer" className="image-explorer" style={{ display: "none" }}>
          <h3>files :</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <button id="btnCreateFolder" className="btnAction" style={{ flex: 1 }}>+ Folder</button>
            <button id="btnUploadImages" className="btnAction" style={{ flex: 1 }}>+ Document</button>
          </div>
          <input type="file" id="imageFilesInput" accept="*" multiple style={{ display: "none" }} />
          <div id="rootDropZone">🏠 Root</div>
          <ul id="imageList"></ul>
        </div>

        {/* Editor */}
        <div className="editor">
          <div className="line-numbers" id="lineNumbers"><span>1</span></div>
          <textarea id="editor" placeholder="Write something here..." />
        </div>
      </div>

      <div className="separator" id="separator"></div>

      {/* Preview */}
      <div className="preview" id="preview">
        <div>
          <div className="pageBtnContainer">
            <button className="btnZoom" id="btnZoomOut">
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.9992 21L14.9492 14.95" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 10H14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span id="zoomLevel">100%</span>
            <button className="btnZoom" id="btnZoomIn">
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.9992 21L14.9492 14.95" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 10H14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 6V14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="btnExport" id="btnExportPdf">Export to PDF</button>
            <button className="btnExport" id="btnExportSvg">Export to SVG</button>
          </div>
          <div id="page"><div></div></div>
        </div>
      </div>
    </div>
  );
}
