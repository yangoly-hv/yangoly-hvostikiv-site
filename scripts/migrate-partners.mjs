import {readFile} from "node:fs/promises";
import {existsSync, readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
import {createClient} from "@sanity/client";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const rootDirectory = join(scriptDirectory, "..");

const loadEnvFile = (fileName) => {
  const filePath = join(rootDirectory, fileName);
  if (!existsSync(filePath)) return;
  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;
    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

loadEnvFile(".env.local");
loadEnvFile(".env");

const loadSanityCliAuthToken = () => {
  const homeDirectory = process.env.HOME || process.env.USERPROFILE;
  if (!homeDirectory) return undefined;
  const configPath = join(homeDirectory, ".config", "sanity", "config.json");
  if (!existsSync(configPath)) return undefined;
  try {
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    return typeof config.authToken === "string" && config.authToken.trim()
      ? config.authToken.trim()
      : undefined;
  } catch {
    return undefined;
  }
};

const token = process.env.SANITY_API_TOKEN || loadSanityCliAuthToken();

if (!token) {
  throw new Error(
    "SANITY_API_TOKEN is required to migrate partners (or login via Sanity CLI)."
  );
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vintpwoh",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2025-05-15",
  token,
  useCdn: false,
});

const publicDirectory = join(rootDirectory, "public");

/**
 * Priority order from chat export (first 10), then remaining, Wellfood last.
 * Match existing Studio docs by stable id, website host, or name.
 */
const partners = [
  {
    id: "mavsy",
    name: "Mavsy",
    sortOrder: 1,
    websiteUrl: "https://mavsy.ua",
    match: {hosts: ["mavsy.ua"], names: ["mavsy"]},
  },
  {
    id: "ua-hearts",
    name: "Ua hearts",
    sortOrder: 2,
    websiteUrl: "https://u-hearts.com/uk/",
    match: {hosts: ["u-hearts.com"], names: ["ua hearts", "u hearts"]},
  },
  {
    id: "burbur",
    name: "Burbur",
    sortOrder: 3,
    websiteUrl: "https://goodpetstores.com.ua",
    match: {
      hosts: ["goodpetstores.com.ua"],
      names: ["burbur", "goodpets"],
    },
  },
  {
    id: "barpi",
    name: "Barpi",
    sortOrder: 4,
    websiteUrl: "https://barpi.com.ua",
    match: {hosts: ["barpi.com.ua"], names: ["barpi"]},
  },
  {
    id: "masterzoo",
    name: "MasterZoo",
    sortOrder: 5,
    websiteUrl: "https://masterzoo.ua/ua/",
    match: {hosts: ["masterzoo.ua"], names: ["masterzoo", "master zoo"]},
  },
  {
    id: "navionika",
    name: "Навіоніка",
    sortOrder: 6,
    imagePath: "images/partners/habiohika.png",
    websiteUrl: "https://www.navionika.com",
    match: {hosts: ["navionika.com"], names: ["навіоніка", "navionika"]},
  },
  {
    id: "brit",
    name: "Brit",
    sortOrder: 7,
    imagePath: "images/partners/brit.png",
    websiteUrl: "https://brit-petfood.com/ua",
    match: {hosts: ["brit-petfood.com", "brit-petfood.com.ua"], names: ["brit"]},
  },
  {
    id: "myata-event-agency",
    name: "Myata event agency",
    sortOrder: 8,
    imagePath: "images/partners/myata-event-agency.webp",
    websiteUrl: "https://www.myata-event.com.ua",
    match: {hosts: ["myata-event.com.ua"], names: ["myata"]},
  },
  {
    id: "practik",
    name: "PRACTIK",
    sortOrder: 9,
    imagePath: "images/partners/practik.png",
    websiteUrl: "https://practik.ua",
    match: {hosts: ["practik.ua"], names: ["practic", "practik"]},
  },
  {
    id: "vog-dog-salon",
    name: "V.O.G DOG salon",
    sortOrder: 10,
    imagePath: "images/partners/vog-dog-salon.webp",
    websiteUrl: "https://vogdog.com/",
    match: {hosts: ["vogdog.com"], names: ["v.o.g", "vog"]},
  },
  {
    id: "bark-and-tail",
    name: "Bark&Tail",
    sortOrder: 11,
    websiteUrl: "https://barkandtail.com.ua",
    match: {hosts: ["barkandtail.com.ua"], names: ["bark&tail", "bark and tail"]},
  },
  {
    id: "brovko",
    name: "Бровко маркет",
    sortOrder: 12,
    websiteUrl: "https://brovko.pet",
    match: {hosts: ["brovko.pet"], names: ["бровко", "brovko"]},
  },
  {
    id: "natural-pet-food",
    name: "Natural pet food",
    sortOrder: 13,
    websiteUrl: "https://naturalpetfood.com.ua",
    match: {
      hosts: ["naturalpetfood.com.ua"],
      names: ["natural pet food"],
    },
  },
  {
    id: "samokus",
    name: "Samokus",
    sortOrder: 14,
    websiteUrl: "https://www.instagram.com/samokus.treats",
    match: {
      hosts: ["instagram.com"],
      names: ["samokus"],
      urlIncludes: ["samokus.treats"],
    },
  },
  {
    id: "myasmyas",
    name: "Мяс-мяс",
    sortOrder: 15,
    websiteUrl: "https://www.myasmyas.com.ua",
    match: {hosts: ["myasmyas.com.ua"], names: ["мяс", "myas"]},
  },
  {
    id: "hat-dog",
    name: "Hat dog",
    sortOrder: 16,
    websiteUrl: "https://hatdog.com.ua",
    match: {hosts: ["hatdog.com.ua"], names: ["hat dog", "hatdog"]},
  },
  {
    id: "cuddo",
    name: "Cuddo",
    sortOrder: 17,
    websiteUrl: "https://www.instagram.com/cuddo.ua",
    match: {
      hosts: ["instagram.com"],
      names: ["cuddo"],
      urlIncludes: ["cuddo.ua"],
    },
  },
  {
    id: "wellfood",
    name: "Wellfood",
    sortOrder: 18,
    imagePath: "images/partners/wellfood.webp",
    websiteUrl: "https://wellfood.kyiv.ua",
    match: {hosts: ["wellfood.kyiv.ua"], names: ["wellfood", "well food"]},
  },
];

const normalizeHost = (value) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

const normalizeName = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();

const findExistingPartner = (existingPartners, partner) => {
  const preferredId = `partner-${partner.id}`;
  const byId = existingPartners.find((item) => item._id === preferredId);
  if (byId) return byId;

  const hosts = new Set((partner.match?.hosts || []).map((host) => host.toLowerCase()));
  const names = (partner.match?.names || []).map(normalizeName);
  const urlIncludes = partner.match?.urlIncludes || [];

  return existingPartners.find((item) => {
    const host = normalizeHost(item.websiteUrl || "");
    const name = normalizeName(item.name);
    const url = String(item.websiteUrl || "").toLowerCase();

    if (hosts.has(host)) {
      if (urlIncludes.length === 0) return true;
      return urlIncludes.some((fragment) => url.includes(fragment.toLowerCase()));
    }

    return names.some((candidate) => name.includes(candidate));
  });
};

const ensureLogoAssetId = async (existing, partner) => {
  if (existing?.logoAssetId) {
    return existing.logoAssetId;
  }

  if (!partner.imagePath) {
    throw new Error(
      `Partner ${partner.name} needs a logo upload but imagePath is missing and no existing logo was found.`
    );
  }

  const image = await readFile(join(publicDirectory, partner.imagePath));
  const asset = await client.assets.upload("image", image, {
    filename: partner.imagePath.split("/").at(-1),
  });
  return asset._id;
};

const migrate = async () => {
  const existingPartners = await client.fetch(
    `*[_type == "partner"]{
      _id,
      name,
      websiteUrl,
      sortOrder,
      "logoAssetId": logo.asset._ref
    }`
  );

  const claimedIds = new Set();

  for (const partner of partners) {
    const preferredId = `partner-${partner.id}`;
    const existing = findExistingPartner(
      existingPartners.filter((item) => !claimedIds.has(item._id)),
      partner
    );

    if (existing) {
      claimedIds.add(existing._id);
    }

    const documentId = existing?._id || preferredId;
    const logoAssetId = await ensureLogoAssetId(existing, partner);

    const nextDocument = {
      _id: documentId,
      _type: "partner",
      name: existing?.name || partner.name,
      websiteUrl: partner.websiteUrl,
      sortOrder: partner.sortOrder,
      logo: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: logoAssetId,
        },
      },
    };

    await client.createOrReplace(nextDocument);
    console.log(
      `Synced ${partner.name} (${documentId}) sortOrder=${partner.sortOrder}`
    );
  }

  console.log(`Migrated ${partners.length} partners.`);
};

migrate().catch((error) => {
  console.error(
    `Partner migration failed: ${error instanceof Error ? error.message : String(error)}`
  );
  process.exitCode = 1;
});
