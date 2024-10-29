import { MarkdownEditView, MarkdownView, Plugin } from "obsidian";
import { EditorView } from '@codemirror/view';

function addCheckAndDeletePostProcessor(plugin: Plugin) {
	plugin.registerMarkdownPostProcessor((element, context) => {
		renderCheckAndDeleteInMarkdown(plugin, element);
	});
}

function renderCheckAndDeleteInMarkdown(plugin: Plugin, element: HTMLElement) {
	if(element.className == "el-ul") {
		iterateCheckAndDeleteChildren(element, plugin)
	}
}

function iterateCheckAndDeleteChildren(element: HTMLElement, plugin: Plugin) {
	const children = element.childNodes
	children.forEach(child => {
		if(child instanceof HTMLLIElement && /^\s*\([Xx]\)\s/.test(child.textContent ?? "")) {
			// ListItem contains span and text items -> Recursively iterate children if prefixed with "(x)"
			iterateCheckAndDeleteChildren(child, plugin)
		}
		else if (child instanceof HTMLSpanElement && child.className == "list-bullet") {
			// If a span element is present in the listItem, it must be a check-and-delete-button
			child.className = "check-and-delete-task-button";
			child.onClickEvent(() => {
				checkAndDeleteHandler(element, plugin)
			})
		}
		else if(child instanceof HTMLUListElement) {
			// UnorderedList contains listItems -> Recursively iterate children
			iterateCheckAndDeleteChildren(child, plugin)
		}
		else if(child instanceof Text) {
			// Remove prefix "(x) " from rendered text
			child.data = child.data.replace(/^\([xX]\)\s/, "")
		}
		else if(child instanceof HTMLParagraphElement) {
			// Remove prefix "(x) " from rendered text
			child.innerHTML = child.innerHTML.replace(/^\([xX]\)\s/, "")
		}
	})
}

function checkAndDeleteHandler(listItem: HTMLElement, plugin: Plugin) {
	deleteElementFromPreview(listItem);
	deleteElementFromEditor(listItem, plugin)
}

function deleteElementFromPreview(element: HTMLElement) {
	element.remove();
}

async function deleteElementFromEditor(element: HTMLElement, plugin: Plugin) {
	const activeFile = plugin.app.workspace.getActiveFile();
	const activeView = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	const editorView = (activeView?.editor as any).cm as EditorView;
	const state = editorView.state;
	
	const elementText = getElementText(element)
	if (activeFile && editorView && elementText) {
		const fileContent = await plugin.app.vault.read(activeFile);
		const indexOfDeletedLine = fileContent.indexOf("- (x) " + elementText);
		const firstLineToDelete = state.doc.lineAt(indexOfDeletedLine);
		const firstLineToDeleteIndentLevelMatch = firstLineToDelete.text.match(/^\t*/);
		const firstLineToDeleteIndentLevel = firstLineToDeleteIndentLevelMatch![0].length;
		let lastPositionToRemove = firstLineToDelete.to + 1;
		for (let i = firstLineToDelete.number + 1; i < state.doc.lines; i++) {
			const lastLineToDelete = state.doc.line(i)
			const lastLineToDeleteIndentLevelMatch = lastLineToDelete.text.match(/^\t*/);
			const lastLineToDeleteIndentLevel = lastLineToDeleteIndentLevelMatch![0].length;
			if (lastLineToDeleteIndentLevel > firstLineToDeleteIndentLevel) {
				lastPositionToRemove = lastLineToDelete.to + 1;
			}
			else {
				break;
			}
		}

		let firstPart = fileContent.substring(0, firstLineToDelete.from);
		let lastPart = fileContent.substring(lastPositionToRemove)
		await this.app.vault.modify(activeFile, firstPart + lastPart);
	}
}

function getElementText(element: HTMLElement): string {
	let elementText = "";
	const children = element.childNodes;
	for(let i = 0; i < children.length; i++) {
		const child = children.item(i)
		// Text element could either be a paragraph element or raw text
		if (child instanceof Text && !child.nextElementSibling) {
			elementText = child.data;
			break;
		}
		else if(child instanceof HTMLParagraphElement && child.innerText) {
			elementText = child.innerText;
			break;
		}
	}

	return elementText;
}

export default addCheckAndDeletePostProcessor;