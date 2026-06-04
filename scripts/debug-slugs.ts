import "dotenv/config";
import { getProductBySlug } from "../src/queries/products";

async function main() {
  const slug = "rele-promizhne-ly2-as-24-v-asko-ukrem-a0090070001";
  try {
    const result = await getProductBySlug(slug, "uk");
    console.log("Query Result:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Query Error:", error);
  }
}

main();
