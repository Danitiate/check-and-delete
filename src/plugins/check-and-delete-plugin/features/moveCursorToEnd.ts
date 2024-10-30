import { EditorView } from "@codemirror/view";
import { CHECK_AND_DELETE_FULL_PREFIX_EMPTY_LINE_REGEX } from "src/utils/regexConstants";

function moveCursorToEnd(editorView: EditorView) {
    const { state } = editorView;
    const selection = state.selection;
    const line = state.doc.lineAt(selection.main.head);
    
    if (CHECK_AND_DELETE_FULL_PREFIX_EMPTY_LINE_REGEX.test(line.text) && selection.main.head < line.to) {
        requestAnimationFrame(() => {
            editorView.dispatch(
                {
                    // Append trailing space
                    changes: { from: line.from, to: line.to, insert: line.text + " " },
                },
                {
                    // Move the cursor to the line end
                    selection: { anchor: line.to }
                });
        })
    }
}

export default moveCursorToEnd;