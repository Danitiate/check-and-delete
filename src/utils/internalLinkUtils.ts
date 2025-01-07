import { MetadataCache, TFile } from "obsidian";
import { isPreviewMode } from "./getEditorMode";
import { DeleteInternalLinkModal } from "src/plugins/check-and-delete-plugin/features/deleteInternalLinksDialog";

const RESOLVED_INTERNAL_LINK_EDITOR_CLASSNAME = '.cm-hmd-internal-link:not(:has(span.is-unresolved))';
const RESOLVED_INTERNAL_LINK_PREVIEW_CLASSNAME = '.internal-link:not(.is-unresolved)';

export function findAndDeleteInternallyLinkedFiles(elements: HTMLElement[]) {
    const internalLinks = findInternalLinks(elements);
    const linkedFiles = getInternalLinkFiles(internalLinks);
    if (linkedFiles.length > 0) {
        new DeleteInternalLinkModal(this.app, linkedFiles).open();
    }
}

function findInternalLinks(elements: HTMLElement[]): HTMLElement[] {
    const internalLinks: HTMLElement[] = [];
    elements.forEach(element => {
        getResolvedInternalLinks(element).forEach(internalLink => {
            internalLinks.push(internalLink as HTMLElement)
        });
    })

    return internalLinks;
}

function getResolvedInternalLinks(element: HTMLElement): NodeListOf<Element> {
    const internalLinkClassname = isPreviewMode() ? RESOLVED_INTERNAL_LINK_PREVIEW_CLASSNAME : RESOLVED_INTERNAL_LINK_EDITOR_CLASSNAME;
    const internalLinks = element.querySelectorAll(internalLinkClassname);
    return internalLinks;
}

function getInternalLinkFiles(resolvedInternalLinks: HTMLElement[]) {
    const metadataCache: MetadataCache = this.app.metadataCache;
    const activeFile: TFile | null = this.app.workspace.getActiveFile();
    const linkedFiles: TFile[] = [];
    resolvedInternalLinks.forEach(internalLink => {
        const targetFile = metadataCache.getFirstLinkpathDest(internalLink.innerText, activeFile?.path ?? "")
        if (targetFile) {
            linkedFiles.push(targetFile);
        }
    })

    return linkedFiles.unique();
}