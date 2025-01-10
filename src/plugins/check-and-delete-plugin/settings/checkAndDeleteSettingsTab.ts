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

		new Setting(containerEl)
			.setName('Display delete linked notes dialog on delete?')
			.setDesc('Internally linked notes will remain undeleted')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.deleteInternalLinksDialog)
				.onChange(async (value) => {
					this.plugin.settings.deleteInternalLinksDialog = value;
					await this.plugin.saveData(this.plugin.settings);
				})
			);
	}
}