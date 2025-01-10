import { RangeSetBuilder } from "@codemirror/state";
import {
    EditorView,
    Decoration,
    type DecorationSet,
} from "@codemirror/view";
import CheckAndDeleteDecoratorWidget from "./checkAndDeleteDecoratorWidget";
import { CHECK_AND_DELETE_FULL_PREFIX_REGEX } from "src/utils/regexConstants";
import DeleteLineCheckboxPlugin from "src/main";

function buildDecorations(plugin: DeleteLineCheckboxPlugin, editorView: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();
    const { doc: document } = editorView.state;

    editorView.visibleRanges.forEach((visibleRange) => {
        for (let position = visibleRange.from; position <= visibleRange.to;) {
            const line = document.lineAt(position);
            const lineText = line.text;

            // Match the specific pattern "- (x) " at the start of the line
            if (CHECK_AND_DELETE_FULL_PREFIX_REGEX.test(lineText)) {
                const startIndex = lineText.indexOf("-");
                const decoration = Decoration.replace({
                    widget: new CheckAndDeleteDecoratorWidget(plugin),
                });

                builder.add(line.from + startIndex, line.from + startIndex + 5, decoration);
            }

            position = line.to + 1;
        }
    });

    return builder.finish();
}

export default buildDecorations;