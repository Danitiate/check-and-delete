import { EditorView, WidgetType } from "@codemirror/view";
import createCheckAndDeleteSvg from "src/utils/createCheckAndDeleteSvg";
import { getResolvedInternalLinks, getInternalLinkFiles } from "src/utils/internalLinkUtils";
import { activateDeleteInternalLinksDialogView } from "./deleteInternalLinksDialog";

export class CheckAndDeleteDecoratorWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		return this.createCheckAndDeleteButton();
	}

	private createCheckAndDeleteButton() {
		const checkAndDeleteButton = document.createElement("span");
		checkAndDeleteButton.className = "check-and-delete-task-button"
		checkAndDeleteButton.onclick = () => {
			this.deleteLineAndChildren(checkAndDeleteButton);
		}

		createCheckAndDeleteSvg(checkAndDeleteButton);
		return checkAndDeleteButton;
	}

	private deleteLineAndChildren(checkAndDeleteButton: HTMLSpanElement) {
		const toBeRemovedElements = [];
		const parent = checkAndDeleteButton.parentNode as HTMLElement;
		toBeRemovedElements.push(parent);
		const parentIndentLevel = this.extractIndentLevelFromClassname(parent.className);
		let nextSibling = parent.nextElementSibling;
		let nextSiblingIndentLevel = this.extractIndentLevelFromClassname(nextSibling?.className ?? "");
		while (nextSibling && nextSiblingIndentLevel > parentIndentLevel) {
			toBeRemovedElements.push(nextSibling);
			nextSibling = nextSibling.nextElementSibling;
			nextSiblingIndentLevel = this.extractIndentLevelFromClassname(nextSibling?.className ?? "");
		}

		const internalLinks: HTMLElement[] = [];
		toBeRemovedElements.forEach(element => {
			getResolvedInternalLinks(element as HTMLElement).forEach(internalLink => {
				internalLinks.push(internalLink as HTMLElement)
			});
			element.remove();
		});

		const linkedFiles = getInternalLinkFiles(internalLinks)
		activateDeleteInternalLinksDialogView(linkedFiles);
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