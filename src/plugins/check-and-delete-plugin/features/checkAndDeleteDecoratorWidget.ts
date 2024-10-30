import { EditorView, WidgetType } from "@codemirror/view";

export class CheckAndDeleteDecoratorWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		const span = document.createElement("span");
		span.className = "check-and-delete-task-button"
		span.onclick = () => {
			const toBeRemovedElements = [];
			const parent = span.parentNode as HTMLElement;
			toBeRemovedElements.push(parent)
			const parentIndentLevel = this.extractIndentLevelFromClassname(parent.className);
			let nextSibling = parent.nextElementSibling
			let nextSiblingIndentLevel = this.extractIndentLevelFromClassname(nextSibling?.className ?? "");
			while(nextSibling && nextSiblingIndentLevel > parentIndentLevel) {
				toBeRemovedElements.push(nextSibling)
				nextSibling = nextSibling.nextElementSibling
				nextSiblingIndentLevel = this.extractIndentLevelFromClassname(nextSibling?.className ?? "");
			}
			toBeRemovedElements.forEach(element => {
				element.remove();
			})
		}
		return span;
	}

	private extractIndentLevelFromClassname(classname: string): number {
		const match = classname.match(/HyperMD-list-line-(\d+)/);
		if (match) {
			return Number(match[1])
		}
		else {
			return 0;
		}
	}
}

export default CheckAndDeleteDecoratorWidget;