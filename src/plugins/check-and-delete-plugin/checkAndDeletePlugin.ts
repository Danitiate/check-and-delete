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
import { isSourceMode } from "src/utils/getEditorMode";
import addHomeKeyInterceptor from "./features/homeKeyInterceptor";
import { addPluginSettings } from "./settings/checkAndDeleteSettingsTab";
import DeleteLineCheckboxPlugin from "src/main";

class CheckAndDeleteDecorator implements PluginValue {
	plugin: DeleteLineCheckboxPlugin;
	decorations: DecorationSet;

	constructor(plugin: DeleteLineCheckboxPlugin, editorView: EditorView) {
		this.plugin = plugin;
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
			return buildDecorations(this.plugin, editorView);
		}
	}
}

const pluginSpec: PluginSpec<CheckAndDeleteDecorator> = {
	decorations: (value: CheckAndDeleteDecorator) => value.decorations
};

const CheckAndDeleteViewPlugin = (plugin: DeleteLineCheckboxPlugin) => {
	return ViewPlugin.define((editorView) => 
		new CheckAndDeleteDecorator(plugin, editorView),
		pluginSpec
	)
}

function addCheckAndDeletePlugin(plugin: DeleteLineCheckboxPlugin) {
	plugin.registerEditorExtension(CheckAndDeleteViewPlugin(plugin));
	addCheckAndDeletePostProcessor(plugin);
	addPluginSettings(plugin);
	addEnterKeyInterceptor(plugin);
	addHomeKeyInterceptor(plugin);
}

export default addCheckAndDeletePlugin;