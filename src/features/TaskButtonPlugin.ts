import { RangeSetBuilder } from "@codemirror/state";
import { EditorView, Decoration, PluginValue, ViewPlugin, ViewUpdate, type DecorationSet, PluginSpec} from "@codemirror/view";
import { TaskButtonWidget } from "./TaskButtonWidget";

  
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
        }
  }

  destroy() {}

  buildDecorations(editorView: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();
    const { doc: document } = editorView.state;

    editorView.visibleRanges.forEach(visibleRange => {      
      for (let position = visibleRange.from; position <= visibleRange.to;) {
          const line = document.lineAt(position);
          const lineText = line.text;
  
          // Match the specific pattern "- (x)" at the start of the line
          if (/^\s*-\s*\(x\)/.test(lineText)) {
            const decoration = Decoration.replace({
              widget: new TaskButtonWidget(),
            });

            builder.add(line.from, line.from + 5, decoration);  
          }

          position = line.to + 1;
      }
    })

    return builder.finish();
  }
}

const pluginSpec: PluginSpec<TaskButtonPluginValue> = {
  decorations: (value: TaskButtonPluginValue) => value.decorations,
};
  
export const TaskButtonPlugin = ViewPlugin.fromClass(TaskButtonPluginValue, pluginSpec);