import type { LayoutSettings, PaperSize } from "../types";
import type { CSSProperties } from "react";

export const paperSizes: Record<PaperSize, { width: number; height: number; label: string }> = {
  A4: { width: 210, height: 297, label: "A4" },
  A3: { width: 297, height: 420, label: "A3" },
  B4: { width: 257, height: 364, label: "B4" }
};

export function getPaperDimensions(layout: LayoutSettings) {
  const base = paperSizes[layout.paperSize];
  if (layout.orientation === "landscape") {
    return { width: base.height, height: base.width };
  }
  return { width: base.width, height: base.height };
}

export function createPreviewStyle(layout: LayoutSettings): CSSProperties {
  const dimensions = getPaperDimensions(layout);

  return {
    "--paper-width": `${dimensions.width}mm`,
    "--paper-height": `${dimensions.height}mm`,
    "--paper-margin": `${layout.marginMm}mm`,
    "--row-height": `${layout.rowGap}mm`,
    "--check-columns": layout.checkColumnCount,
    "--table-columns": layout.columns,
    fontFamily:
      layout.fontMode === "mincho"
        ? '"Yu Mincho", "Hiragino Mincho ProN", "MS Mincho", serif'
        : '"Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif'
  } as CSSProperties;
}

export function getPageRule(layout: LayoutSettings): string {
  const size = `${layout.paperSize} ${layout.orientation}`;
  return `@page { size: ${size}; margin: ${layout.marginMm}mm; }`;
}
