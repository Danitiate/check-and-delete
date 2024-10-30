import { keymap } from "@codemirror/view"
import { Prec } from "@codemirror/state"
import { Plugin } from "obsidian";
import { CHECK_AND_DELETE_FULL_PREFIX_EMPTY_LINE_REGEX, CHECK_AND_DELETE_FULL_PREFIX_NON_EMPTY_LINE_REGEX, CLOSED_PARANTHESES_X_REGEX, INDEX_OF_PREFIX_REGEX } from "src/utils/regexConstants";

function insertCheckAndDeletePrefixToNextLine() {
    return keymap.of([{
        key: "Enter",
        run(editorView) {
            const { state } = editorView;
            const selection = state.selection;
            const line = state.doc.lineAt(selection.main.head);
            if (CHECK_AND_DELETE_FULL_PREFIX_NON_EMPTY_LINE_REGEX.test(line.text)) {
                const startIndexMatch = line.text.match(CLOSED_PARANTHESES_X_REGEX);
                const startIndex = startIndexMatch?.index ?? 0;
                const checkAndDeletePrefix = "(x) ";
                requestAnimationFrame(() => {
                    // Insert checkAndDeletePrefix to new line
                    editorView.dispatch(
                        {
                            changes: { from: selection.main.head + 1 + startIndex, insert: checkAndDeletePrefix },
                        }
                    );
                    // Move the cursor after the insertion
                    editorView.dispatch(
                        {
                            selection: { anchor: selection.main.head + 1 + startIndex + checkAndDeletePrefix.length }
                        }
                    );
                })
            }
            else if (CHECK_AND_DELETE_FULL_PREFIX_EMPTY_LINE_REGEX.test(line.text)) {
                const startIndexMatch = line.text.match(INDEX_OF_PREFIX_REGEX);
                if (startIndexMatch?.index ?? 0 > 0) {
                    // If item is indented, remove first indent
                    editorView.dispatch({
                        changes: { from: line.from, to: line.from + 1, insert: "" }
                    })
                }
                else {
                    // If item is not indented, clear the line
                    editorView.dispatch({
                        changes: { from: line.from, to: line.to, insert: "" }
                    })
                }
                return true;
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