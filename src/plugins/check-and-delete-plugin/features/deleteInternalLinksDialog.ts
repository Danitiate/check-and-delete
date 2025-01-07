import { App, Modal, Notice, TFile } from 'obsidian';

export class DeleteInternalLinkModal extends Modal {
  constructor(app: App, linkedFiles: TFile[]) {
    super(app);
    this.modalEl.classList.add("delete-internal-link-modal")
    this.titleEl.setText(`Delete ${linkedFiles.length} linked file${linkedFiles.length > 1 ? 's' : ''}?`)

    const modalContent = document.createElement("div");
    this.addLinkedFilesRows(linkedFiles, modalContent);

    const userControls = modalContent.createDiv({ cls: "delete-internal-links-user-control" });
    this.addCancelButton(userControls)
    if (linkedFiles.length > 1) {
        this.addDeleteAllButton(userControls, linkedFiles)
    }

    this.contentEl.appendChild(modalContent);
  }

    private addLinkedFilesRows(linkedFiles: TFile[], modalContent: HTMLDivElement) {
        linkedFiles.forEach(linkedFile => {
            const modalContentRow = modalContent.createDiv({ cls: "delete-internal-link-item-row" });
            modalContentRow.createDiv({ text: linkedFile.path, cls: "delete-internal-link-item-row-text" });
            this.addDeleteButton(modalContentRow, linkedFiles, linkedFile);
        });
    }

    private addDeleteButton(modalContentRow: HTMLDivElement, linkedFiles: TFile[], linkedFile: TFile) {
        modalContentRow.createEl("button", { text: "Delete", cls: "delete-internal-link-button"}, (deleteButton) => {
            deleteButton.addEventListener("click", () => {
                this.deleteFile(linkedFile)
                    .then(() => {
                        new Notice("Deleted: " + linkedFile.path);
                        linkedFiles.remove(linkedFile);
                        modalContentRow.remove();
                        if (linkedFiles.length == 0) {
                            this.close();
                        }
                    })
                    .catch(error => {
                        new Notice("Failed delete: " + error, 10000)
                    })
            })
        })
    }

    private addCancelButton(userControls: HTMLDivElement) {
        userControls.createEl("button", { text: "Close"}, (cancelButton) => {
            cancelButton.addEventListener("click", () => {
                this.close();
            })
        })
    }
  
    private addDeleteAllButton(userControls: HTMLDivElement, linkedFiles: TFile[]) {
        userControls.createEl("button", { text: "Delete All", cls: "delete-internal-link-button"}, (deleteAllButton) => {
            deleteAllButton.addEventListener("click", () => {
                this.deleteFiles(linkedFiles).then(failedDeletes => {
                    if (failedDeletes.length < linkedFiles.length) {
                        new Notice(`Successfully deleted ${linkedFiles.length - failedDeletes.length} files`)
                    }
                    if (failedDeletes.length > 0) {
                        new Notice(`Failed to delete the following files:\n- ${failedDeletes.join("\n- ")}`, 10000)
                    }
                });
            })
        })
    }

    private async deleteFiles(linkedFiles: TFile[]): Promise<string[]> {
        new Notice(`Deleting ${linkedFiles.length} files...`);
        const failedDeletes: string[] = [];
        await Promise.all(
            linkedFiles.map(async linkedFile => {
                await this.deleteFile(linkedFile)
                    .catch(error => {
                        failedDeletes.push(linkedFile.name);
                    })
            }));

        return failedDeletes;
    }

    private async deleteFile(linkedFile: TFile): Promise<void> {
        // TODO: trash or delete based on settings
        return this.app.vault.delete(linkedFile)
    }
}

