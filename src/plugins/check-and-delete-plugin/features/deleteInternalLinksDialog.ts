import { App, Modal, Setting, TFile } from 'obsidian';

export function activateDeleteInternalLinksDialogView(linkedFiles: TFile[]) {
    if (linkedFiles.length > 0) {
        new DeleteInternalLinkModal(this.app, linkedFiles).open();
    }
}

export class DeleteInternalLinkModal extends Modal {
  constructor(app: App, linkedFiles: TFile[]) {
    super(app);
    this.titleEl.setText(`Delete ${linkedFiles.length} linked file${linkedFiles.length > 1 ? 's' : ''}`)

    linkedFiles.forEach(linkedFile => {
        new Setting(this.contentEl)
            .setName(linkedFile.path)
            .addButton((button) => {
                button.setButtonText("Delete")
                      .setClass("delete-internal-link-button")
            })
    })

    const userControls = document.createElement("div");
    userControls.className = "delete-internal-links-user-control";
    this.addCancelButton(userControls)
    if (linkedFiles.length > 1) {
        this.addDeleteAllButton(userControls)
    }

    this.contentEl.appendChild(userControls);
  }

  private addCancelButton(userControls: HTMLDivElement) {
      userControls.createEl("button", { text: "Close"}, (cancelButton) => {
          cancelButton.addEventListener("click", () => {
              this.close();
          })
      })
  }
  
  private addDeleteAllButton(userControls: HTMLDivElement) {
      userControls.createEl("button", { text: "Delete All", cls: "delete-internal-link-button"}, (deleteAllButton) => {
          deleteAllButton.addEventListener("click", () => {
              this.close();
          })
      })
  }
}

