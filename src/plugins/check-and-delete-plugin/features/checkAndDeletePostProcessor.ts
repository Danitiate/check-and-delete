import { TFile } from "obsidian";
import DeleteLineCheckboxPlugin from "src/main";
import createCheckAndDeleteSvg from "src/utils/createCheckAndDeleteSvg";
import { findAndDeleteInternallyLinkedFiles } from "src/utils/internalLinkUtils";
import { CHECK_AND_DELETE_NO_HYPHEN_REGEX, CHECK_AND_DELETE_FULL_PREFIX_REGEX, STARTS_WITH_TABS_REGEX } from "src/utils/regexConstants";

function addCheckAndDeletePostProcessor(plugin: DeleteLineCheckboxPlugin) {
	plugin.registerMarkdownPostProcessor((element, context) => {
		renderCheckAndDeleteInMarkdown(plugin, element);
	});
}

function renderCheckAndDeleteInMarkdown(plugin: DeleteLineCheckboxPlugin, element: HTMLElement) {
	if(element.className == "el-ul") {
		iterateCheckAndDeleteChildren(plugin, element)
	}
}

function iterateCheckAndDeleteChildren(plugin: DeleteLineCheckboxPlugin, element: HTMLElement) {
	const children = element.childNodes
	children.forEach(child => {
		if( child instanceof HTMLUListElement || // UnorderedList contains ListItems
			child instanceof HTMLLIElement || // ListItems contains Span and Text items
			child instanceof HTMLParagraphElement) { // Paragraph contains Text items
			iterateCheckAndDeleteChildren(plugin, child)
		}
		else if (child instanceof HTMLSpanElement && child.className == "list-bullet" && CHECK_AND_DELETE_NO_HYPHEN_REGEX.test(element.textContent ?? "")) {
			// If a span element is present in the listItem, it must be a check-and-delete-button if prefixed with (x)
			child.className = "check-and-delete-task-button";
			child.onClickEvent(() => {
				checkAndDeleteHandler(plugin, element)
			})

			createCheckAndDeleteSvg(child)
		}
		else if(child instanceof Text) {
			// Remove prefix "(x) " from rendered text
			child.data = child.data.replace(CHECK_AND_DELETE_NO_HYPHEN_REGEX, "")
		}
	})
}

function checkAndDeleteHandler(plugin: DeleteLineCheckboxPlugin, listItem: HTMLElement) {
	findAndDeleteInternallyLinkedFiles(plugin, [listItem]);
	deleteElementFromPreview(listItem);
	deleteElementFromEditor(listItem)
}

function deleteElementFromPreview(element: HTMLElement) {
	element.remove();
}

async function deleteElementFromEditor(element: HTMLElement) {
	const activeFile: TFile | null = this.app.workspace.getActiveFile();
	const elementText = getElementText(element)
	if (activeFile) {
		await this.app.vault.process(activeFile, (data: string) => {
			const fileLines = data.split("\n");
			const newFileLines: string[] = [];
			for(let i = 0; i < fileLines.length; i++) {
				const nextLine = fileLines[i];
				const nextLineText = nextLine.replace(CHECK_AND_DELETE_FULL_PREFIX_REGEX, "");
				if (CHECK_AND_DELETE_FULL_PREFIX_REGEX.test(nextLine) && nextLineText == elementText) {
					i = skipChildLines(fileLines, i);
				}
				else {
					newFileLines.push(nextLine);
				}
			}

			return newFileLines.join("\n")
		})
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
			elementText += nextElementSibling instanceof HTMLParagraphElement ? nextElementSibling.innerText : child.data;
		} else if (child instanceof HTMLAnchorElement) {
			if (child.className.contains("internal-link")) {
				// Handle if displayName doesn't match target
				const childTarget = getUrlTarget(child.href);
				const alias = childTarget != child.textContent ? `${childTarget}|` : '';
				// Internal links are surrounded by double square brackets in Obsidian
				elementText += `[[${alias}${child.textContent}]]`;
			}
			else {
				let anchorText = child.outerHTML;
				anchorText = anchorText.replace(" target=\"_blank\"", "")
				anchorText = anchorText.replace(" rel=\"noopener nofollow\"", "")
				elementText += anchorText;
			}
		}
	}

	return elementText.trim();
}

function getUrlTarget(href: string) {
	const url = new URL(href);
	const relativePath = decodeURIComponent(url.pathname);
	return relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
}

function skipChildLines(fileLines: string[], indexOfDeletedLine: number): number {
	const deletedLineIndentLevelMatch = fileLines[indexOfDeletedLine].match(STARTS_WITH_TABS_REGEX);
	const deletedLineIndentLevel = deletedLineIndentLevelMatch?.[0].length ?? 0;
	for(let i = indexOfDeletedLine + 1; i < fileLines.length; i++) {
		const subsequentLineIndentLevelMatch = fileLines[i].match(STARTS_WITH_TABS_REGEX);
		const subsequentLineIndentLevel = subsequentLineIndentLevelMatch?.[0].length ?? 0;
		if (subsequentLineIndentLevel <= deletedLineIndentLevel) {
			return i - 1;
		}
	}

	return fileLines.length;
}

export default addCheckAndDeletePostProcessor;

