// Записать новые processedUrl (перецученные выцветшие) из faded_fixed.jsonl в БД.
import * as fs from "fs";
for (const line of fs.readFileSync("C:\\Users\\sevri\\Сайт\\elektronom\\.env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
(async () => {
  const { prisma } = await import("../src/lib/prisma");
  const FILE = "D:/elektronom_photos/faded_fixed.jsonl";
  if (!fs.existsSync(FILE)) { console.error("no faded_fixed.jsonl"); process.exit(1); }
  const map = new Map<string, string>();
  for (const line of fs.readFileSync(FILE, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try { const r = JSON.parse(line); if (r.imageId && r.url) map.set(r.imageId, r.url); } catch {}
  }
  const entries = [...map.entries()];
  console.log("faded processedUrl to update:", entries.length);
  const BATCH = 20; let done = 0, err = 0;
  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    await Promise.all(batch.map(async ([id, url]) => {
      try { await prisma.productImage.update({ where: { id }, data: { processedUrl: url } }); done++; }
      catch { err++; }
    }));
    if ((i / BATCH) % 25 === 0) console.log(`  ${done}/${entries.length} (err ${err})`);
  }
  console.log(`DONE: updated=${done} err=${err}`);
  await prisma.$disconnect();
})();
