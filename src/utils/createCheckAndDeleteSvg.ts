function createCheckAndDeleteSvg(span: HTMLSpanElement) {
    const svg = span.createSvg("svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    const path = svg.createSvg("path", "check-and-delete-path");
    path.setAttribute("d", "M15,15 L85,85 M15,85 L85,15");
}

export default createCheckAndDeleteSvg;