import { RangeSetBuilder } from "@codemirror/state";
import {
  EditorView,
  Decoration,
  PluginValue,
  ViewPlugin,
  ViewUpdate,
  type DecorationSet,
  PluginSpec,
} from "@codemirror/view";
import TaskButtonWidget from "./taskButtonWidget";

const BUILD_DECORATIONS_CHECK_AND_DELETE_TASK_BUTTON_REGEX = /^\s*-\s*\([Xx]\)\s/;

class TaskButtonPluginValue implements PluginValue {
  decorations: DecorationSet;

  constructor(editorView: EditorView) {
    this.decorations = this.buildDecorations(editorView);
  }

  update(viewUpdate: ViewUpdate) {
    if (
      viewUpdate.docChanged ||
      viewUpdate.viewportChanged ||
      viewUpdate.selectionSet
    ) {
      this.decorations = this.buildDecorations(viewUpdate.view);
      if (viewUpdate.docChanged) {
        this.moveCursorToEnd(viewUpdate.view);
      }
    }
  }

  destroy() { }

  buildDecorations(editorView: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();
    const { doc: document } = editorView.state;

    editorView.visibleRanges.forEach((visibleRange) => {
      for (let position = visibleRange.from; position <= visibleRange.to;) {
        const line = document.lineAt(position);
        const lineText = line.text;
        
        // Match the specific pattern "- (x) " at the start of the line
        if (BUILD_DECORATIONS_CHECK_AND_DELETE_TASK_BUTTON_REGEX.test(lineText)) {
          var startIndex = lineText.indexOf("-");
          const decoration = Decoration.replace({
            widget: new TaskButtonWidget(),
          });

          builder.add(line.from + startIndex, line.from + startIndex + 5, decoration);
        }

        position = line.to + 1;
      }
    });

    return builder.finish();
  }

  moveCursorToEnd(editorView: EditorView) {
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
          // Move the cursor to the line end
          {
            selection: { anchor: line.to }
          });
      })
    }
  }
}

const pluginSpec: PluginSpec<TaskButtonPluginValue> = {
  decorations: (value: TaskButtonPluginValue) => value.decorations,
};

export const TaskButtonPlugin = ViewPlugin.fromClass(
  TaskButtonPluginValue,
  pluginSpec
);
