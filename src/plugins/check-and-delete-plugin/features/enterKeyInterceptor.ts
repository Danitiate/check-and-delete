import { keymap } from "@codemirror/view"
import { Prec } from "@codemirror/state"
import { Plugin } from "obsidian";

function insertCheckAndDeletePrefixToNextLine() {
    return keymap.of([{
        key: "Enter",
        run(editorView) {
            const { state } = editorView;
            const selection = state.selection;
            const line = state.doc.lineAt(selection.main.head);
            if (/^\s*-\s*\([xX]\)\s/.test(line.text)) {
                const startIndex = line.text.indexOf("(x)");
                const checkAndDeletePrefix = "(x) ";                
                requestAnimationFrame(() => {
                    editorView.dispatch(
                        {
                            changes: { from: selection.main.head + 1 + startIndex, insert: checkAndDeletePrefix },
                        }
                    );
                })
            }

            return false // Continue default behavior
        }
    }])
}

function addEnterKeyInterceptor(plugin: Plugin) {
    plugin.registerEditorExtension(
        Prec.high(insertCheckAndDeletePrefixToNextLine())
    );
}

export default addEnterKeyInterceptor;