import { Plugin } from 'obsidian';
import { TaskButtonPlugin } from './features/taskButtonPlugin';
import addTaskButtonPostProcessorPlugin from './features/taskButtonPostProcessorPlugin';

export default class DeleteLineCheckboxPlugin extends Plugin {
	async onload() {
		this.registerEditorExtension(TaskButtonPlugin);
		addTaskButtonPostProcessorPlugin(this);
	}
}
