import { Plugin } from "obsidian";

function addCheckAndDeletePostProcessor(plugin: Plugin) {
	plugin.registerMarkdownPostProcessor((element, context) => {
		renderCheckAndDeleteInMarkdown(element);
	});
}

function renderCheckAndDeleteInMarkdown(element: HTMLElement) {
	if(element.className == "el-ul") {
		iterateCheckAndDeleteChildren(element)
	}
}

function iterateCheckAndDeleteChildren(element: HTMLElement) {
	const children = element.childNodes
	children.forEach(child => {
		if(child instanceof HTMLLIElement && /^\s*\([Xx]\)\s/.test(child.textContent ?? "")) {
			// ListItem contains span and text items -> Recursively iterate children if prefixed with "(x)"
			iterateCheckAndDeleteChildren(child)
		}
		else if (child instanceof HTMLSpanElement && child.className == "list-bullet") {
			// If a span element is present in the listItem, it must be a check-and-delete-button
			child.className = "check-and-delete-task-button";
			child.onClickEvent(() => {
				checkAndDeleteHandler(element)
			})
		}
		else if(child instanceof HTMLUListElement) {
			// UnorderedList contains listItems -> Recursively iterate children
			iterateCheckAndDeleteChildren(child)
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

function checkAndDeleteHandler(listItem: HTMLElement) {
	deleteElementFromPreview(listItem);
	deleteElementFromEditor(listItem)
}

function deleteElementFromPreview(element: HTMLElement) {
	element.remove();
}

async function deleteElementFromEditor(element: HTMLElement) {
	const activeFile = this.app.workspace.getActiveFile();
	const elementText = getElementText(element)
	if (activeFile && elementText) {
		const fileContent = await this.app.vault.read(activeFile);
		const fileLines = fileContent.split("\n");
		const newFileLines = [];
		for(let i = 0; i < fileLines.length; i++) {
			const nextLine = fileLines[i];
			if (/\s*-\s*\([xX]\)\s/.test(nextLine) && nextLine.endsWith(elementText)) {
				i = skipChildLines(fileLines, i);
			}
			else {
				newFileLines.push(nextLine);
			}
		}

		await this.app.vault.modify(activeFile, newFileLines.join("\n"));
	}
}

function getElementText(element: HTMLElement): string {
	let elementText = "";
	const children = element.childNodes;
	for(let i = 0; i < children.length; i++) {
		const child = children.item(i)
		if (child instanceof Text) {
			const nextElementSibling = child.nextElementSibling;
			// Text element could either be a paragraph element or raw text
			elementText = nextElementSibling instanceof HTMLParagraphElement ? nextElementSibling.innerText : child.data;
			break;
		}
	}

	return elementText.trim();
}

function skipChildLines(fileLines: string[], indexOfDeletedLine: number): number {
	const deletedLineIndentLevelMatch = fileLines[indexOfDeletedLine].match(/^\t*/);
	const deletedLineIndentLevel = deletedLineIndentLevelMatch?.[0].length ?? 0;
	for(let i = indexOfDeletedLine + 1; i < fileLines.length; i++) {
		const subsequentLineIndentLevelMatch = fileLines[i].match(/^\t*/);
		const subsequentLineIndentLevel = subsequentLineIndentLevelMatch?.[0].length ?? 0;
		if (subsequentLineIndentLevel <= deletedLineIndentLevel) {
			return i - 1;
		}
	}

	return fileLines.length;
}

export default addCheckAndDeletePostProcessor;

