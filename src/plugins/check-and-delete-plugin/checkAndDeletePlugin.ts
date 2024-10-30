import { Plugin } from "obsidian";
import addCheckAndDeletePostProcessor from "./features/checkAndDeletePostProcessor";
import {
	EditorView,
	PluginValue,
	ViewPlugin,
	ViewUpdate,
	DecorationSet,
	PluginSpec,
} from "@codemirror/view";
import { RangeSet } from "@codemirror/state";
import buildDecorations from "./features/decoratorBuilder";
import moveCursorToEnd from "./features/moveCursorToEnd";
import addEnterKeyInterceptor from "./features/enterKeyInterceptor";
import isSourceMode from "src/utils/isSourceMode";

class CheckAndDeleteDecorator implements PluginValue {
	decorations: DecorationSet;

	constructor(editorView: EditorView) {
		this.decorations = this.setDecorationsForMode(editorView);
	}

	update(viewUpdate: ViewUpdate) {
		this.decorations = this.setDecorationsForMode(viewUpdate.view);
		if (viewUpdate.docChanged) {
			moveCursorToEnd(viewUpdate.view);
		}
	}

	destroy() { }

	private setDecorationsForMode(editorView: EditorView) {
		if (isSourceMode()) {
			return RangeSet.empty;
		}
		else {
			return buildDecorations(editorView);
		}
	}
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