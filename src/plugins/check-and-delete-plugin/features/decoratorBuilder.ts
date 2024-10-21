import { RangeSetBuilder } from "@codemirror/state";
import {
    EditorView,
    Decoration,
    type DecorationSet,
} from "@codemirror/view";
import CheckAndDeleteDecoratorWidget from "./checkAndDeleteDecoratorWidget";

const BUILD_DECORATIONS_CHECK_AND_DELETE_TASK_BUTTON_REGEX = /^\s*-\s\([Xx]\)\s/;

function buildDecorations(editorView: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();
    const { doc: document } = editorView.state;

    editorView.visibleRanges.forEach((visibleRange) => {
        for (let position = visibleRange.from; position <= visibleRange.to;) {
            const line = document.lineAt(position);
            const lineText = line.text;

            // Match the specific pattern "- (x) " at the start of the line
            if (BUILD_DECORATIONS_CHECK_AND_DELETE_TASK_BUTTON_REGEX.test(lineText)) {
                const startIndex = lineText.indexOf("-");
                const decoration = Decoration.replace({
                    widget: new CheckAndDeleteDecoratorWidget(),
                });

                builder.add(line.from + startIndex, line.from + startIndex + 5, decoration);
            }

            position = line.to + 1;
        }
    });

    return builder.finish();
}

export default buildDecorations;