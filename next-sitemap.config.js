/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,

  async transform(config, path) {
    const baseConfig = {
      loc: `${config.siteUrl}${path}`,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };

    if (path === "/[locale]") {
      return {
        ...baseConfig,
        priority: 1.0,
        changefreq: "daily",
      };
    }

    if (
      [
        "/[locale]/charity-events",
        "/[locale]/partnership",
        "/[locale]/reporting",
        "/[locale]/sterilization-of-tails",
      ].includes(path)
    ) {
      return {
        ...baseConfig,
        priority: 0.8,
        changefreq: "weekly",
      };
    }

    if (
      path.includes("/[locale]/blog/[id]") ||
      path.includes("/[locale]/tails/[id]")
    ) {
      return {
        ...baseConfig,
        priority: 0.6,
        changefreq: "monthly",
      };
    }

    return baseConfig;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async additionalPaths(config) {
    const paths = [];

    const locales = ["en", "uk"];

    const staticPages = [
      "/charity-events",
      "/partnership",
      "/reporting",
      "/sterilization-of-tails",
    ];

    locales.forEach((locale) => {
      paths.push({
        loc: `/${locale}`,
      });

      staticPages.forEach((page) => {
        paths.push({
          loc: `/${locale}${page}`,
        });
      });
    });

    return paths;
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
