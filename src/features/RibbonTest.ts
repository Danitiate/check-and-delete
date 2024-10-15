import { Notice, Plugin } from 'obsidian';

function AddRibbonTest(plugin: Plugin) {
    plugin.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
        // Called when the user clicks the icon.
        new Notice('This is a notice!');
    });
}

export default AddRibbonTest;