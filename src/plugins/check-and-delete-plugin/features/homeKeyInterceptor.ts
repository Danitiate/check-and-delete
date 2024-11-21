import { keymap } from "@codemirror/view"
import { Prec } from "@codemirror/state"
import { Plugin } from "obsidian";
import { CHECK_AND_DELETE_FULL_PREFIX_NON_EMPTY_LINE_REGEX, INDEX_OF_PREFIX_REGEX } from "src/utils/regexConstants";

function preventMovingCursorPastWidget(key: string) {
    return keymap.of([{
        key: key,
        run(editorView) {
            const { state } = editorView;
            const selection = state.selection;
            const line = state.doc.lineAt(selection.main.head);
            const isShifted = key.contains("Shift");
            if (CHECK_AND_DELETE_FULL_PREFIX_NON_EMPTY_LINE_REGEX.test(line.text)) {
                const startIndexMatch = line.text.match(INDEX_OF_PREFIX_REGEX);
                const positionOfWidget = line.from + startIndexMatch!.index! + "- (x) ".length;
                if(selection.main.head > positionOfWidget) {
                    editorView.dispatch(
                        {
                            selection: { 
                                anchor: isShifted ? selection.main.head : positionOfWidget, 
                                head: isShifted ? positionOfWidget : undefined 
                            }
                        }
                    );

                }
                else {
                    editorView.dispatch(
                        {
                            selection: { 
                                anchor: isShifted ? selection.main.head : line.from, 
                                head: isShifted ? line.from : undefined
                            }
                        }
                    )
                }

                return true;
            }

            return false // Continue default behavior
        }
    }])
}

function addHomeKeyInterceptor(plugin: Plugin) {
    plugin.registerEditorExtension(
        Prec.high(preventMovingCursorPastWidget("Shift-Home"))
    )

    plugin.registerEditorExtension(
        Prec.high(preventMovingCursorPastWidget("Home"))
    )
}

export default addHomeKeyInterceptor;