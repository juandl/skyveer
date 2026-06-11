import * as fs from "node:fs";
import * as path from "node:path";

export type IniSections = Record<string, Record<string, string>>;

export const parseIniFile = (filePath: string): IniSections => {
  const sections: IniSections = {};
  if (!fs.existsSync(filePath)) return sections;
  const content = fs.readFileSync(filePath, "utf-8");
  let currentSection: string | null = null;
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith(";")) continue;
    const sectionMatch = trimmed.match(/^\[(.+)\]$/);
    if (sectionMatch?.[1]) {
      const name = sectionMatch[1];
      currentSection = name;
      sections[name] = {};
      continue;
    }
    if (!currentSection) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex !== -1) {
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      sections[currentSection][key] = value;
    }
  }
  return sections;
};

export const writeIniFile = (filePath: string, sections: IniSections): void => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const lines: string[] = [];
  for (const [section, keys] of Object.entries(sections)) {
    lines.push(`[${section}]`);
    for (const [key, value] of Object.entries(keys)) {
      lines.push(`${key} = ${value}`);
    }
    lines.push("");
  }
  fs.writeFileSync(filePath, lines.join("\n"));
};
