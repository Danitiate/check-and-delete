export interface CheckAndDeleteSettings {
    deleteInternalLinksDialog: boolean;
    deleteNotesPermanently: boolean;
}

export const DEFAULT_SETTINGS: CheckAndDeleteSettings = {
    deleteInternalLinksDialog: true,
    deleteNotesPermanently: false
}