import { App, PluginSettingTab, Setting } from "obsidian";
import DeleteLineCheckboxPlugin from "src/main";
import { DEFAULT_SETTINGS } from "./checkAndDeleteSettings";

export async function addPluginSettings(plugin: DeleteLineCheckboxPlugin) {
	await loadSettings(plugin);
	plugin.addSettingTab(new CheckAndDeleteSettingsTab(plugin.app, plugin));
}

async function loadSettings(plugin: DeleteLineCheckboxPlugin) {
	plugin.settings = Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());
}

class CheckAndDeleteSettingsTab extends PluginSettingTab {
    plugin: DeleteLineCheckboxPlugin;

	constructor(app: App, plugin: DeleteLineCheckboxPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

    display(): void {
		const {containerEl} = this;
		containerEl.empty();
		containerEl.createEl("h1", { text: "Enabled Features" })

		const deleteLinkedNotePopupSetting = this.createDeleteLinkedNotePopupSetting(containerEl);
		const deleteNotesPermanentlySetting = this.createDeleteNotesPermanentlySetting(containerEl);
		this.addDeleteLinkedNotePopupSettingToggle(deleteLinkedNotePopupSetting, deleteNotesPermanentlySetting);
	}
	
	private createDeleteLinkedNotePopupSetting(containerEl: HTMLElement) {
		return new Setting(containerEl)
			.setName('Display delete linked notes dialog on delete?')
			.setDesc('When disabled, internally linked notes will not be deleted.');
	}

	private createDeleteNotesPermanentlySetting(containerEl: HTMLElement) {
		const deleteNotesPermanentlySetting = new Setting(containerEl)
		.setName('Delete linked notes permanently?')
		.setDesc('When disabled, linked notes will be sent to trash. When enabled, notes are deleted permanently. Sync users can recover permanently deleted notes.')
		.addToggle(toggle => toggle
			.setValue(this.plugin.settings.deleteNotesPermanently)
			.onChange(async (value) => {
				this.plugin.settings.deleteNotesPermanently = value;
				await this.saveSettings();
			})
		);

		if (!this.plugin.settings.deleteInternalLinksDialog) {
			deleteNotesPermanentlySetting.setClass("hidden-setting")
		}

		return deleteNotesPermanentlySetting;
	}

	private addDeleteLinkedNotePopupSettingToggle(deleteLinkedNotePopupSetting: Setting, deleteNotesPermanentlySetting: Setting) {
		deleteLinkedNotePopupSetting.addToggle(toggle => toggle
			.setValue(this.plugin.settings.deleteInternalLinksDialog)
			.onChange(async (value) => {
				this.plugin.settings.deleteInternalLinksDialog = value;
				if (value) {
					deleteNotesPermanentlySetting.settingEl.classList.remove('hidden-setting')
				}
				else {
					deleteNotesPermanentlySetting.setClass('hidden-setting');
					
				}
				await this.saveSettings();
			})
		);
	}

	private async saveSettings() {
		await this.plugin.saveData(this.plugin.settings);
	}
}