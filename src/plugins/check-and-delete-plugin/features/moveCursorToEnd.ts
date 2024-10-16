import { EditorView } from "@codemirror/view";

function moveCursorToEnd(editorView: EditorView) {
    const { state } = editorView;
    const selection = state.selection;
    const line = state.doc.lineAt(selection.main.head);

    if (line.text.trim().startsWith("- (x)") && !line.text.includes("- (x) ")) {
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