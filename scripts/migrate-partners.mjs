import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
import {createClient} from "@sanity/client";

const token = process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error("SANITY_API_TOKEN is required to migrate partners.");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vintpwoh",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2025-05-15",
  token,
  useCdn: false,
});

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const publicDirectory = join(scriptDirectory, "..", "public");

const partners = [
  {
    id: "navionika",
    name: "Навіоніка",
    imagePath: "images/partners/habiohika.png",
    websiteUrl: "https://www.navionika.com/",
  },
  {
    id: "brit",
    name: "Brit",
    imagePath: "images/partners/brit.png",
    websiteUrl: "https://brit-petfood.com.ua/",
  },
  {
    id: "myata-event-agency",
    name: "Myata event agency",
    imagePath: "images/partners/myata-event-agency.webp",
    websiteUrl: "https://www.myata-event.com.ua/",
  },
  {
    id: "practik",
    name: "PRACTIK",
    imagePath: "images/partners/practik.png",
    websiteUrl: "https://practik.ua/",
  },
  {
    id: "vog-dog-salon",
    name: "V.O.G DOG salon",
    imagePath: "images/partners/vog-dog-salon.webp",
    websiteUrl: "https://vogdog.com/",
  },
];

const migrate = async () => {
  for (const partner of partners) {
    const documentId = `partner-${partner.id}`;
    const existing = await client.fetch(
      '*[_id == $documentId][0]{"logoAssetId": logo.asset._ref}',
      {documentId}
    );
    let logoAssetId = existing?.logoAssetId;

    if (!logoAssetId) {
      const image = await readFile(join(publicDirectory, partner.imagePath));
      const asset = await client.assets.upload("image", image, {
        filename: partner.imagePath.split("/").at(-1),
      });
      logoAssetId = asset._id;
    }

    await client.createOrReplace({
      _id: documentId,
      _type: "partner",
      name: partner.name,
      websiteUrl: partner.websiteUrl,
      logo: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: logoAssetId,
        },
      },
    });

    console.log(`Migrated ${partner.name}`);
  }
};

migrate().catch(error => {
  console.error(`Partner migration failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
