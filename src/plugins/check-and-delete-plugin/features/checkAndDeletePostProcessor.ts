import { Plugin } from "obsidian";

function renderCheckAndDeleteInMarkdown(element: HTMLElement) {
  const listItems = element.findAll("li");
  for (let listItem of listItems) {
    if(/^\s*\([Xx]\)\s/.test(listItem.textContent ?? "")) {
      listItem.innerHTML = listItem.innerHTML.replace("list-bullet", "check-and-delete-task-button")
      listItem.innerHTML = listItem.innerHTML.replace("<p>(x) ", "<p>")

      let span = listItem.firstChild as HTMLElement;
      span.onClickEvent(() => {
        const parent = span.parentNode as HTMLElement;
        parent.remove();
        // TODO: Remove text from Editor
      })
    }
  }
}

function addCheckAndDeletePostProcessor(plugin: Plugin) {
    plugin.registerMarkdownPostProcessor((element, context) => {
      renderCheckAndDeleteInMarkdown(element);  
    });
}

export default addCheckAndDeletePostProcessor;