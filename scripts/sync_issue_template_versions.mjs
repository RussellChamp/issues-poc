import fs from "fs";
import path from "path";
import YAML from "yaml";

const repoRoot = process.cwd();
const versionsFile = path.join(repoRoot, ".github/issue-data/versions.yml");
const templateDir = path.join(repoRoot, ".github/ISSUE_TEMPLATE");

const versionsDoc = YAML.parse(fs.readFileSync(versionsFile, "utf8"));
const versions = (versionsDoc?.versions ?? []).map(String);

const files = fs.readdirSync(templateDir).filter((f) => f.endsWith(".yml"));

for (const file of files) {
  const fullPath = path.join(templateDir, file);
  const content = fs.readFileSync(fullPath, "utf8");
  const doc = YAML.parse(content);

  if (!doc?.body) continue;

  for (const item of doc.body) {
    if (item?.type === "dropdown" && item?.id === "version") {
      item.attributes.options = versions;
    }
  }

  fs.writeFileSync(fullPath, YAML.stringify(doc));
}
