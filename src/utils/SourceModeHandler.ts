import { MarkdownView, Plugin } from "obsidian";

// Class used to determine if the Obsidian Editor is in SourceMode or not
class SourceModeHandler {
    private static registered = false;
    public static isSourceMode = false;

    public static registerSourceModeEvent(plugin: Plugin) {
        if (!this.registered) {
            plugin.registerEvent(
                plugin.app.workspace.on('layout-change', () => this.handleLayoutChange(plugin))
            );
            this.handleLayoutChange(plugin);
        }

        this.registered = true;
    }

    private static handleLayoutChange(plugin: Plugin) {
        const leaves = plugin.app.workspace.getLeavesOfType('markdown');
        leaves.forEach(leaf => {
            const view = leaf.view;
            if (view instanceof MarkdownView) {
                if (view.getMode() == "preview") {
                    this.isSourceMode = false;
                }
                else {
                    const state = view.getState();
                    const source = state["source"] as boolean;
                    this.isSourceMode = source;
                }
            }
        });
    }
}

export default SourceModeHandler;