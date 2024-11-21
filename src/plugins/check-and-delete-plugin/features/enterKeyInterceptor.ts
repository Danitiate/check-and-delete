import { keymap } from "@codemirror/view"
import { Prec } from "@codemirror/state"
import { Plugin } from "obsidian";
import { CHECK_AND_DELETE_FULL_PREFIX_EMPTY_LINE_REGEX, CHECK_AND_DELETE_FULL_PREFIX_NON_EMPTY_LINE_REGEX, INDEX_OF_PREFIX_REGEX } from "src/utils/regexConstants";

function insertCheckAndDeletePrefixToNextLine() {
    return keymap.of([{
        key: "Enter",
        run(editorView) {
            const { state } = editorView;
            const selection = state.selection;
            const line = state.doc.lineAt(selection.main.head);
            if (CHECK_AND_DELETE_FULL_PREFIX_NON_EMPTY_LINE_REGEX.test(line.text)) {
                let checkAndDeletePrefix = "\n";
                checkAndDeletePrefix += line.text.substring(0, line.text.indexOf("-")); // Keep indent level
                checkAndDeletePrefix += "- (x) ";
                editorView.dispatch(
                    {
                        // Insert checkAndDeletePrefix to new line
                        changes: { from: selection.main.head, insert: checkAndDeletePrefix },
                        // Move the cursor after the insertion
                        selection: { anchor: selection.main.head + checkAndDeletePrefix.length }
                    }
                );

                return true;
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