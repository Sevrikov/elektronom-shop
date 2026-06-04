import { prisma } from "../src/lib/prisma";
import * as fs from "fs";

(async () => {
  const map = new Map<string, string>();
  for (const fn of [
    "D:/elektronom_photos/cloudinary_uploads.jsonl",
    "D:/elektronom_photos/cloudinary_uploads_tier3.jsonl",
  ]) {
    if (!fs.existsSync(fn)) continue;
    for (const line of fs.readFileSync(fn, "utf-8").split("\n")) {
      if (!line.trim()) continue;
      try {
        const r = JSON.parse(line);
        if (r.imageId && r.url) map.set(r.imageId, r.url);
      } catch {}
    }
  }
  const entries = [...map.entries()];
  console.log("ProductImage to set processedUrl:", entries.length);

  const BATCH = 20;
  let done = 0, err = 0;
  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async ([id, url]) => {
        try {
          await prisma.productImage.update({ where: { id }, data: { processedUrl: url } });
          done++;
        } catch (e) {
          err++;
        }
      })
    );
    if ((i / BATCH) % 50 === 0) {
      console.log(`${done}/${entries.length} (err ${err})`);
      fs.writeFileSync("D:/elektronom_photos/_dbwrite_status.json", JSON.stringify({ total: entries.length, done, err, ts: Date.now() }));
    }
  }
  fs.writeFileSync("D:/elektronom_photos/_dbwrite_status.json", JSON.stringify({ total: entries.length, done, err, finished: true, ts: Date.now() }));
  console.log(`DONE: processedUrl set=${done} err=${err}`);
  await prisma.$disconnect();
})();
