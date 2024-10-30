import { Plugin } from 'obsidian';
import addCheckAndDeletePlugin from './plugins/check-and-delete-plugin/checkAndDeletePlugin';

export default class DeleteLineCheckboxPlugin extends Plugin {
	async onload() {
		addCheckAndDeletePlugin(this);
	}
}
