import { Plugin } from 'obsidian';
import AddRibbonTest from './features/RibbonTest';
import { TaskButtonPlugin } from './features/TaskButtonPlugin';

export default class DeleteLineCheckboxPlugin extends Plugin {
	async onload() {
		AddRibbonTest(this);

		this.registerEditorExtension(TaskButtonPlugin);
	}
}
