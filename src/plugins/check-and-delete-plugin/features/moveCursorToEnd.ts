import { EditorView } from "@codemirror/view";

const MOVE_CURSOR_CHECK_AND_DELETE_TASK_BUTTON_REGEX = /^\s*-\s\([Xx]\)$/;

function moveCursorToEnd(editorView: EditorView) {
    const { state } = editorView;
    const selection = state.selection;
    const line = state.doc.lineAt(selection.main.head);
    
    if (MOVE_CURSOR_CHECK_AND_DELETE_TASK_BUTTON_REGEX.test(line.text) && selection.main.head < line.to) {
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