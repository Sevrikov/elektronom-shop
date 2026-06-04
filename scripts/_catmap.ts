import {prisma} from "../src/lib/prisma";
import * as fs from "fs";
(async()=>{
  const prods = await prisma.product.findMany({
    where:{ isActive:true },
    select:{ sku:true, category:{ select:{ slug:true, parent:{ select:{ slug:true } } } } }
  });
  const map:any={};
  for(const p of prods){ if(p.sku) map[String(p.sku).trim()]=[p.category?.slug||"?", p.category?.parent?.slug||""]; }
  fs.writeFileSync("D:/elektronom_photos/category_map.json", JSON.stringify(map));
  console.log("CATMAP "+Object.keys(map).length); await prisma.$disconnect();
})();