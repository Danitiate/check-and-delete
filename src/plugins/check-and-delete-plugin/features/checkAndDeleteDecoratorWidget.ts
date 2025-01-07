import { EditorView, WidgetType } from "@codemirror/view";
import createCheckAndDeleteSvg from "src/utils/createCheckAndDeleteSvg";
import { findAndDeleteInternallyLinkedFiles } from "src/utils/internalLinkUtils";

export class CheckAndDeleteDecoratorWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		return this.createCheckAndDeleteButton();
	}

	private createCheckAndDeleteButton() {
		const checkAndDeleteButton = document.createElement("span");
		checkAndDeleteButton.className = "check-and-delete-task-button";
		checkAndDeleteButton.onclick = () => {
			this.deleteLineAndChildren(checkAndDeleteButton);
		}

		createCheckAndDeleteSvg(checkAndDeleteButton);
		return checkAndDeleteButton;
	}

	private deleteLineAndChildren(checkAndDeleteButton: HTMLSpanElement) {
		const parent = checkAndDeleteButton.parentNode as HTMLElement;
		const toBeRemovedElements = this.collectToBeRemovedElements(parent);
		findAndDeleteInternallyLinkedFiles(toBeRemovedElements);
		toBeRemovedElements.forEach(element => {
			element.remove();
		});
	}

	private collectToBeRemovedElements(parent: HTMLElement): HTMLElement[] {
		const toBeRemovedElements: HTMLElement[] = [];
		toBeRemovedElements.push(parent);
		const parentIndentLevel = this.extractIndentLevelFromClassname(parent.className);
		let nextSibling = parent.nextElementSibling;
		let nextSiblingIndentLevel = this.extractIndentLevelFromClassname(nextSibling?.className ?? "");
		while (nextSibling && nextSiblingIndentLevel > parentIndentLevel) {
			toBeRemovedElements.push(nextSibling as HTMLElement);
			nextSibling = nextSibling.nextElementSibling;
			nextSiblingIndentLevel = this.extractIndentLevelFromClassname(nextSibling?.className ?? "");
		}

		return toBeRemovedElements;
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