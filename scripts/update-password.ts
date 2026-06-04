import "dotenv/config"
import { prisma } from "../src/lib/prisma"
import bcryptjs from "bcryptjs"

async function main() {
  const newHash = await bcryptjs.hash("admin123456", 10)
  const updated = await prisma.user.update({
    where: { email: "admin@elektronom.com" },
    data: { passwordHash: newHash }
  })
  console.log("Updated admin password successfully:", updated.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
