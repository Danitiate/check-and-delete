import { MarkdownView } from "obsidian";

function isSourceMode() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView)        
    if (view) {
        if (view.getMode() == "preview") {
            return false;
        }
        else {
            const state = view.getState();
            const source = state["source"] as boolean;
            return source;
        }
    }

    return false;
}

export default isSourceMode;