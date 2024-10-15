import { EditorView, WidgetType } from "@codemirror/view";

export class TaskButtonWidget extends WidgetType {
  toDOM(view: EditorView): HTMLElement {
    const span = document.createElement("span");
    span.className = "check-and-delete-task-button"
    span.onclick = () => {
      const parent = span.parentNode as HTMLElement;
      parent.remove();
    }
    return span;
  }
}

export default TaskButtonWidget;