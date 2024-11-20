import { EditorView, WidgetType } from "@codemirror/view";

export class CheckAndDeleteDecoratorWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		return this.createCheckAndDeleteButton();
	}

	private createCheckAndDeleteButton() {
		const checkAndDeleteButton = document.createElement("span");
		checkAndDeleteButton.className = "check-and-delete-task-button"
		checkAndDeleteButton.onclick = () => {
			const toBeRemovedElements = [];
			const parent = checkAndDeleteButton.parentNode as HTMLElement;
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

		this.createCheckAndDeleteSvg(checkAndDeleteButton);
		return checkAndDeleteButton;
	}

	private createCheckAndDeleteSvg(span: HTMLSpanElement) {
		const svg = span.createSvg("svg");
		svg.setAttribute("viewBox", "0 0 100 100");
		const path = svg.createSvg("path", "check-and-delete-path");
		path.setAttribute("d", "M15,15 L85,85 M15,85 L85,15");
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