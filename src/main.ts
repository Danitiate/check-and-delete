import { Plugin } from 'obsidian';
import addCheckAndDeletePlugin from './plugins/check-and-delete-plugin/checkAndDeletePlugin';
import { CheckAndDeleteSettings } from './plugins/check-and-delete-plugin/settings/checkAndDeleteSettings';

export default class DeleteLineCheckboxPlugin extends Plugin {
	settings: CheckAndDeleteSettings;

	async onload() {
		addCheckAndDeletePlugin(this);
	}
}
