import { MetadataCache, TFile } from "obsidian";
import { isPreviewMode } from "./getEditorMode";
import { DeleteInternalLinkModal } from "src/plugins/check-and-delete-plugin/features/deleteInternalLinksDialog";
import DeleteLineCheckboxPlugin from "src/main";

const RESOLVED_INTERNAL_LINK_EDITOR_CLASSNAME = '.cm-hmd-internal-link:not(:has(span.is-unresolved)) > a';
const RESOLVED_INTERNAL_LINK_PREVIEW_CLASSNAME = '.internal-link:not(.is-unresolved)';

export function findAndDeleteInternallyLinkedFiles(plugin: DeleteLineCheckboxPlugin, elements: HTMLElement[]) {
    if (plugin.settings.deleteInternalLinksDialog) {
        const internalLinks = findInternalLinks(elements);
        const linkedFiles = getInternalLinkFiles(internalLinks);
        if (linkedFiles.length > 0) {
            new DeleteInternalLinkModal(plugin, linkedFiles).open();
        }
    }
}

function findInternalLinks(elements: HTMLElement[]): HTMLAnchorElement[] {
    const internalLinks: HTMLAnchorElement[] = [];
    elements.forEach(element => {
        const resolvedInternalLinks = getResolvedInternalLinks(element);
        resolvedInternalLinks.forEach(internalLink => {
            internalLinks.push(internalLink as HTMLAnchorElement)
        });
    })

    return internalLinks;
}

function getResolvedInternalLinks(element: HTMLElement): NodeListOf<Element> {
    const internalLinkClassname = isPreviewMode() ? RESOLVED_INTERNAL_LINK_PREVIEW_CLASSNAME : RESOLVED_INTERNAL_LINK_EDITOR_CLASSNAME;
    const internalLinks = element.querySelectorAll(internalLinkClassname);
    return internalLinks;
}

function getInternalLinkFiles(resolvedInternalLinks: HTMLAnchorElement[]) {
    const metadataCache: MetadataCache = this.app.metadataCache;
    const activeFile: TFile | null = this.app.workspace.getActiveFile();
    const linkedFiles: TFile[] = [];
    resolvedInternalLinks.forEach(internalLink => {
        const files = metadataCache.getCache(activeFile?.path ?? "");
        if (files && files.links) {
            const matchingFile = files.links.find(file => file.displayText == internalLink.text);
            if (matchingFile) {
                const targetFile = metadataCache.getFirstLinkpathDest(matchingFile.link, activeFile?.path ?? "")
                if (targetFile) {
                    linkedFiles.push(targetFile)
                }
            }
        }
    })

    return linkedFiles.unique();
}