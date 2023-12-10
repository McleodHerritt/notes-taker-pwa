// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from "./database";
import { header } from "./header";
import localStorage from "localStorage";

// export default class {
//   constructor() {
//     const localData = localStorage.getItem("content");
export default class Editor {
  constructor() {
    this.initEditor();
    //this.initEventListeners();
    //this.fetchAndRenderCards();
  }
  // check if CodeMirror is loaded
  // if (typeof CodeMirror === "undefined") {
  //   throw new Error("CodeMirror is not loaded");
  // }
  initEditor() {
    const localData = localStorage.getItem("content");
    if (typeof CodeMirror === "undefined") {
      throw new Error("CodeMirror is not loaded");
    }
    this.editor = CodeMirror(document.querySelector("#main"), {
      value: "",
      mode: "javascript",
      theme: "monokai",
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    getDb().then((data) => {
      console.info("Loaded data from IndexedDB, injecting into editor");
      this.editor.setValue(data || localData);
    });

    this.editor.on("change", () => {
      localStorage.setItem("content", this.editor.getValue());
    });

    // Save the content of the editor when the editor itself loses focus
    this.editor.on("blur", () => {
      putDb(this.editor.getValue());
    });
  }
}

new Editor();
