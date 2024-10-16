import { Plugin } from "obsidian";
import addCheckAndDeletePostProcessor from "./features/checkAndDeletePostProcessor";
import {
    EditorView,
    PluginValue,
    ViewPlugin,
    ViewUpdate,
    type DecorationSet,
    PluginSpec,
  } from "@codemirror/view";
import buildDecorations from "./features/decoratorBuilder";
import moveCursorToEnd from "./features/moveCursorToEnd";
import addEnterKeyInterceptor from "./features/enterKeyInterceptor";
  
class CheckAndDeleteDecorator implements PluginValue {
  decorations: DecorationSet;

  constructor(editorView: EditorView) {
    this.decorations = buildDecorations(editorView);
  }

  update(viewUpdate: ViewUpdate) {
    if (
      viewUpdate.docChanged ||
      viewUpdate.viewportChanged ||
      viewUpdate.selectionSet
    ) {
      this.decorations = buildDecorations(viewUpdate.view);
      if (viewUpdate.docChanged) {
        moveCursorToEnd(viewUpdate.view);
      }
    }
  }

  destroy() { }
}

const pluginSpec: PluginSpec<CheckAndDeleteDecorator> = {
  decorations: (value: CheckAndDeleteDecorator) => value.decorations
};

const TaskButtonPlugin = ViewPlugin.fromClass(
  CheckAndDeleteDecorator,
  pluginSpec
);

function addCheckAndDeletePlugin(plugin: Plugin) {
    plugin.registerEditorExtension(TaskButtonPlugin);
    addCheckAndDeletePostProcessor(plugin);
    addEnterKeyInterceptor(plugin);
}

export default addCheckAndDeletePlugin;