import { Plugin } from 'obsidian';
import addCheckAndDeletePlugin from './plugins/check-and-delete-plugin/checkAndDeletePlugin';
import SourceModeHandler from './utils/SourceModeHandler';

export default class DeleteLineCheckboxPlugin extends Plugin {
	async onload() {
		SourceModeHandler.registerSourceModeEvent(this);
		addCheckAndDeletePlugin(this);
	}
}
