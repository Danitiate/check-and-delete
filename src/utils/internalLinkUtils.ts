import { MetadataCache, TFile } from "obsidian";
import { isPreviewMode } from "./getEditorMode";

const RESOLVED_INTERNAL_LINK_EDITOR_CLASSNAME = '.cm-hmd-internal-link:not(:has(span.is-unresolved))';
const RESOLVED_INTERNAL_LINK_PREVIEW_CLASSNAME = '.internal-link:not(.is-unresolved)';

export function getResolvedInternalLinks(element: HTMLElement): NodeListOf<Element> {
    const internalLinkClassname = isPreviewMode() ? RESOLVED_INTERNAL_LINK_PREVIEW_CLASSNAME : RESOLVED_INTERNAL_LINK_EDITOR_CLASSNAME;
    const internalLinks = element.querySelectorAll(internalLinkClassname);
    return internalLinks;
}

export function getInternalLinkFiles(resolvedInternalLinks: HTMLElement[]) {
    const metadataCache: MetadataCache = this.app.metadataCache;
    const activeFile: TFile | null = this.app.workspace.getActiveFile();
    const linkedFiles: TFile[] = [];
    resolvedInternalLinks.forEach(internalLink => {
        const targetFile = metadataCache.getFirstLinkpathDest(internalLink.innerText, activeFile?.path ?? "")
        if (targetFile) {
            linkedFiles.push(targetFile);
        }
    })

    console.log(linkedFiles);

    return linkedFiles;
}