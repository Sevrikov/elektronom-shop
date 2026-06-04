import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../src/lib/prisma";

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

// Bypass Next.js cache calls in standalone script context
(global as any).cacheLife = () => {};
(global as any).cacheTag = () => {};

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.find(a => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : 50;

  console.log("🚀 Starting non-destructive background removal backfill script...");
  console.log(`Limit per run: ${limit} images`);

  if (!isCloudinaryConfigured) {
    console.error("❌ Cloudinary is not configured. Please set the following environment variables:");
    console.error("   CLOUDINARY_CLOUD_NAME");
    console.error("   CLOUDINARY_API_KEY");
    console.error("   CLOUDINARY_API_SECRET");
    console.error("\nSkipping backfill.");
    process.exit(0);
  }

  // Fetch images that need processing (processedUrl is null)
  // We prioritize images of active products first
  const images = await prisma.productImage.findMany({
    where: {
      processedUrl: null,
    },
    include: {
      product: {
        select: {
          isActive: true,
          slug: true,
        }
      }
    },
    orderBy: [
      { product: { isActive: "desc" } },
      { sortOrder: "asc" },
    ],
    take: limit,
  });

  console.log(`Found ${images.length} unprocessed images (prioritizing active products).`);

  if (images.length === 0) {
    console.log("✅ All images are already processed!");
    return;
  }

  let successCount = 0;
  let skippedBgCount = 0;
  let errorCount = 0;

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    console.log(`[${i + 1}/${images.length}] Processing image ${img.id} (product: ${img.product?.slug || "unknown"}, provider: ${img.provider})...`);

    try {
      // Determine what source URL to upload
      // We always upload the original url if possible
      const sourceUrl = img.originalUrl || img.url;

      // Upload to Cloudinary with eager background removal transformation
      const uploadResult = await cloudinary.uploader.upload(sourceUrl, {
        folder: "elektronom/products",
        resource_type: "image",
        eager: [{ effect: "bgremoval" }],
      });

      const processedUrl = uploadResult.eager?.[0]?.secure_url || null;

      // 1. If background removal succeeded (it returned a processed eager URL that is different from original)
      if (processedUrl && processedUrl !== uploadResult.secure_url) {
        await prisma.productImage.update({
          where: { id: img.id },
          data: {
            url: uploadResult.secure_url, // Update fallback url to Cloudinary original
            originalUrl: img.originalUrl || img.url, // Save the original source URL
            processedUrl: processedUrl, // Set processedUrl to transparent PNG version
            provider: "CLOUDINARY",
            publicId: uploadResult.public_id,
            width: uploadResult.width || img.width,
            height: uploadResult.height || img.height,
            format: uploadResult.format || img.format,
            size: uploadResult.bytes || img.size,
          },
        });
        console.log(`    ✅ Success! Processed URL: ${processedUrl}`);
        successCount++;
      } else {
        // 2. If background removal failed or was skipped by Cloudinary, we still keep the original url.
        // We can safely upload/cache the original image on Cloudinary, keeping processedUrl as null.
        await prisma.productImage.update({
          where: { id: img.id },
          data: {
            url: uploadResult.secure_url, // Update fallback url to Cloudinary original
            originalUrl: img.originalUrl || img.url, // Save the original source URL
            processedUrl: null, // Remains null so we know it's not transparent, but the original is cached
            provider: "CLOUDINARY",
            publicId: uploadResult.public_id,
            width: uploadResult.width || img.width,
            height: uploadResult.height || img.height,
            format: uploadResult.format || img.format,
            size: uploadResult.bytes || img.size,
          },
        });
        console.log(`    ⚠️ Cloudinary background removal failed or returned original image. Saved original cached version.`);
        skippedBgCount++;
      }
    } catch (err) {
      console.error(`    ❌ Error processing image ${img.id}:`, err instanceof Error ? err.message : err);
      errorCount++;
    }
  }

  console.log(`\n🎉 Backfill run completed!`);
  console.log(`Success (with background removal): ${successCount}`);
  console.log(`Success (original cached, no bg removal): ${skippedBgCount}`);
  console.log(`Errors: ${errorCount}`);
}

main()
  .catch((err) => {
    console.error("❌ Critical error during backfill:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
