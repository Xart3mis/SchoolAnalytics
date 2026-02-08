export type CsvRow = Record<string, string | number | boolean | null | undefined>;

function sanitizeFileName(value: string) {
  return value
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "chart";
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function selectChartSvg(container: HTMLElement) {
  const rechartsSvg = container.querySelector("svg.recharts-surface");
  if (rechartsSvg instanceof SVGSVGElement) {
    return rechartsSvg;
  }

  const allSvgs = Array.from(container.querySelectorAll("svg"));
  if (allSvgs.length === 0) return null;

  // Fallback: choose the largest SVG to avoid selecting icon SVGs.
  const largest = allSvgs.reduce<{ svg: SVGSVGElement | null; area: number }>(
    (best, current) => {
      if (!(current instanceof SVGSVGElement)) return best;
      const rect = current.getBoundingClientRect();
      const area = rect.width * rect.height;
      if (area > best.area) {
        return { svg: current, area };
      }
      return best;
    },
    { svg: null, area: 0 }
  );
  return largest.svg;
}

function resolveCssVariablesInSvg(source: string) {
  const rootStyles = getComputedStyle(document.documentElement);

  return source.replace(
    /var\(\s*(--[A-Za-z0-9-_]+)\s*(?:,\s*([^)]+))?\)/g,
    (_full, variableName: string, fallback?: string) => {
      const value = rootStyles.getPropertyValue(variableName).trim();
      if (value) return value;
      if (fallback) return fallback.trim();
      return "currentColor";
    }
  );
}

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function exportRowsAsCsv(rows: CsvRow[], title: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ];

  triggerDownload(
    new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }),
    `${sanitizeFileName(title)}.csv`
  );
}

export async function exportChartAreaAsPng(container: HTMLElement, title: string) {
  const svg = selectChartSvg(container);
  if (!svg) return;

  const rect = svg.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  clonedSvg.setAttribute("width", String(Math.round(rect.width)));
  clonedSvg.setAttribute("height", String(Math.round(rect.height)));

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(clonedSvg);
  if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
    source = source.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  source = resolveCssVariablesInSvg(source);

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const image = new Image();
  image.decoding = "async";

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Unable to render chart image."));
    image.src = url;
  });

  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(rect.width * scale));
  canvas.height = Math.max(1, Math.floor(rect.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    URL.revokeObjectURL(url);
    return;
  }

  context.scale(scale, scale);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, rect.width, rect.height);
  context.drawImage(image, 0, 0, rect.width, rect.height);
  URL.revokeObjectURL(url);

  const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!pngBlob) return;

  triggerDownload(pngBlob, `${sanitizeFileName(title)}.png`);
}
