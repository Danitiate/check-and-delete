export const STARTS_WITH_HYPHEN_REGEX = /^\s*-\s/; // "- " or "    - "
export const CLOSED_PARANTHESES_X_REGEX = /\([xX]\)/; // "(x)" or "(X)"
export const INDEX_OF_PREFIX_REGEX = /-\s*\([xX]\)/; // "- (x)" or "- (X)"
export const CHECK_AND_DELETE_FULL_PREFIX_REGEX = /^\s*-\s\([xX]\)\s/; // "- (x) " or "- (X) "
export const CHECK_AND_DELETE_FULL_PREFIX_EMPTY_LINE_REGEX = /^\s*-\s\([xX]\)\s*$/; // "- (x)    " or "- (X)   "
export const CHECK_AND_DELETE_FULL_PREFIX_NON_EMPTY_LINE_REGEX = /^\s*-\s\([xX]\)\s+\S/; // "- (x) ..." or "- (X)   ...   "
export const CHECK_AND_DELETE_NO_HYPHEN_REGEX = /^\s*\([xX]\)\s/; // " (x) " or "(X) "
export const STARTS_WITH_TABS_REGEX = /^\t*/;