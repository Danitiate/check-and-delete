import { MarkdownEditView, MarkdownView, Plugin } from "obsidian";
import { EditorView } from '@codemirror/view';

function renderCheckAndDeleteInMarkdown(plugin: Plugin, element: HTMLElement) {
	const listItems = element.findAll("li");
	for (let listItem of listItems) {
		if (/^\s*\([Xx]\)\s/.test(listItem.textContent ?? "")) {
			listItem.innerHTML = listItem.innerHTML.replace(/class=\"list-bullet\"/g, "class=\"check-and-delete-task-button\"")
			listItem.innerHTML = listItem.innerHTML.replace(/<p>\([xX]\)\s/g, "<p>")
			listItem.innerHTML = listItem.innerHTML.replace(/<\/span>\([xX]\)\s/g, "</span>")

			let span = listItem.firstChild as HTMLElement;
			span.onClickEvent(async (event) => {
				// Remove item from file / editor
				const activeFile = plugin.app.workspace.getActiveFile();
				const activeView = plugin.app.workspace.getActiveViewOfType(MarkdownView);
				const editorView = (activeView?.editor as any).cm as EditorView;
				if(activeFile && editorView && listItem.textContent) {
					let fileContent = await plugin.app.vault.read(activeFile);
					const targetString = "- (x) " + listItem.textContent.trim();
					const state = editorView.state;
					for(let i = 1; i <= state.doc.lines; i++) {
						const line = state.doc.line(i);
						if (targetString == line.text.trim()) {
							const firstPart = fileContent.substring(0, line.from)
							const lastPart = fileContent.substring(line.to + 1)
							fileContent = firstPart + lastPart;
							await this.app.vault.modify(activeFile, fileContent);
							listItem.remove(); // Removes item from render
							break;
						}
					}
				}
			})
		}
	}
}

function addCheckAndDeletePostProcessor(plugin: Plugin) {
	plugin.registerMarkdownPostProcessor((element, context) => {
		renderCheckAndDeleteInMarkdown(plugin, element);
	});
}

export default addCheckAndDeletePostProcessor;