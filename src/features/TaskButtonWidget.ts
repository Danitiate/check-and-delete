import { EditorView, Decoration, ViewPlugin, ViewUpdate, WidgetType, type DecorationSet } from "@codemirror/view";

export class TaskButtonWidget extends WidgetType {
  toDOM(view: EditorView): HTMLElement {
    const div = document.createElement("span");
    div.innerText = "👉"; // Todo: Replace with X button
    return div;
  }

  
}

export default TaskButtonWidget;