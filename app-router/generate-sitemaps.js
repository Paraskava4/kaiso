const fs = require("fs");
const path = require("path");

// Function to scan src/app for page files and generate allow paths
function getAllowPaths() {
    const appDir = path.join(__dirname, "src", "app");
    const allowPaths = new Set();

    function scanDir(dir, currentPath = "") {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                const newPath = currentPath ? `${currentPath}/${item}` : `/${item}`;
                scanDir(fullPath, newPath);
            } else if (item === "page.js" || item === "page.jsx") {
                // Replace [param] with *
                const cleanPath = currentPath.replace(/\[([^\]]+)\]/g, "*");
                allowPaths.add(cleanPath);
            }
        }
    }

    scanDir(appDir);
    return Array.from(allowPaths).sort();
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://api.kaisoresearch.com";

const generateXML = (urls) => {
    const urlset = urls
        .map(
            (url) =>
                `    <url><loc>${url.loc}</loc><lastmod>${url.lastmod}</lastmod><changefreq>${url.changefreq}</changefreq><priority>${url.priority}</priority></url>`
        )
        .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlset}
</urlset>`;
};

const generateCategorySitemaps = async () => {
    const allowPaths = getAllowPaths();
    // List of pages without generateMetadata to exclude from sitemap and robots.txt
    const excludedPaths = [
        "/admin/dashboard",
        "/admin/masters/hero-section-form",
        "/admin",
        "/admin/setting",
        "/auth/back_to_login",
        "/auth/forgotpassword",
        "/auth/login",
        "/auth",
        "/auth/setnewpassword",
        "/auth/verify_code",
        "/blogDetails",
        "/checkout",
        "/cookiepolicy",
        "/custom-report-form",
        "/deliveryformats",
        "/error",
        "/gdrp",
        "/inquiry-before-buy",
        "/privacypolicy",
        "/report-details",
        "/retunpolicy",
        "/sitemap",
        "/success",
        "/termsandcondition",
        "/disclaimer",
    ];
    try {
        // Generate sitemap-0.xml with static pages, excluding admin, auth, error, pages without generateMetadata, and wildcard paths
        const staticUrls = allowPaths
            .filter(
                (path) =>
                    !path.startsWith("/admin") &&
                    !path.startsWith("/auth") &&
                    path !== "/error" &&
                    !excludedPaths.includes(path) &&
                    !["/*", "/*/*", "/*/*/*"].includes(path)
            )
            .map((path) => ({
                loc: `https://www.kaisoresearch.com${path}`,
                changefreq: "weekly",
                priority: 0.7,
                lastmod: new Date().toISOString(),
            }));
        const staticXml = generateXML(staticUrls);
        fs.writeFileSync(path.join(__dirname, "public", "sitemap-0.xml"), staticXml);
        console.log("sitemap-0.xml generated with static pages");

        // Fetch categories
        const catResponse = await fetch(`${BASE_URL}/web/categoryAndSubcategory`);
        if (!catResponse.ok) throw new Error("Failed to fetch categories");
        const catData = await catResponse.json();
        const reportCategories = catData.data.reportCategories || [];
        const blogCategories = catData.data.blogCategories || [];
        const newsCategories = catData.data.newsArticleCategories || [];
        console.log("Categories data:", catData);

        // Fetch reports
        const repResponse = await fetch(`${BASE_URL}/web/getReport`);
        if (!repResponse.ok) throw new Error("Failed to fetch reports");
        const repData = await repResponse.json();
        const reports = repData.data || [];
        console.log("Sample reports:", reports.slice(0, 2));

        // Group reports by categoryId
        const reportsByCat = {};
        reports.forEach((report) => {
            const catId = report.categoryId._id;
            if (!reportsByCat[catId]) reportsByCat[catId] = [];
            reportsByCat[catId].push(report);
        });

        // Fetch blogs
        let blogsByCat = {};
        try {
            const blogResponse = await fetch(`${BASE_URL}/web/getDataByCategoryAndSubcategory?type=blogs`);
            if (!blogResponse.ok) {
                console.warn("Failed to fetch blogs:", blogResponse.status);
            } else {
                const blogData = await blogResponse.json();
                const blogs = blogData.data || [];
                console.log("Sample blogs:", blogs.slice(0, 2));

                // Group blogs by categoryId
                blogs.forEach((blog) => {
                    const catId = blog.categoryId;
                    if (!blogsByCat[catId]) blogsByCat[catId] = [];
                    blogsByCat[catId].push(blog);
                });
            }
        } catch (error) {
            console.warn("Error fetching blogs:", error.message);
        }

        // Fetch articles
        let articlesByCat = {};
        try {
            const artResponse = await fetch(`${BASE_URL}/web/getDataByCategoryAndSubcategory?type=news-articles`);
            if (!artResponse.ok) {
                console.warn("Failed to fetch articles:", artResponse.status);
            } else {
                const artData = await artResponse.json();
                const articles = artData.data || [];
                console.log("Sample articles:", articles.slice(0, 2));

                // Group articles by categoryId
                articles.forEach((article) => {
                    const catId = article.categoryId;
                    if (!articlesByCat[catId]) articlesByCat[catId] = [];
                    articlesByCat[catId].push(article);
                });
            }
        } catch (error) {
            console.warn("Error fetching articles:", error.message);
        }

        // Generate sitemaps
        const sitemapFiles = ["sitemap-0.xml"];
        let sitemapIndex = 1;

        // For report categories
        reportCategories.forEach((category) => {
            const catReports = reportsByCat[category._id] || [];
            if (catReports.length > 0) {
                const urls = catReports.map((report) => ({
                    loc: `https://www.kaisoresearch.com/report-store/${report.url}`,
                    changefreq: "weekly",
                    priority: 0.7,
                    lastmod: report.updatedAt || new Date().toISOString(),
                }));
                const xml = generateXML(urls);
                const filename = `sitemap-${sitemapIndex}.xml`;
                fs.writeFileSync(path.join(__dirname, "public", filename), xml);
                sitemapFiles.push(filename);
                sitemapIndex++;
            }
        });

        // For blog categories
        blogCategories.forEach((category) => {
            const catBlogs = blogsByCat[category._id] || [];
            if (catBlogs.length > 0) {
                const urls = catBlogs.map((blog) => ({
                    loc: `https://www.kaisoresearch.com/blog/${blog.url}`,
                    changefreq: "weekly",
                    priority: 0.7,
                    lastmod: blog.updatedAt || new Date().toISOString(),
                }));
                const xml = generateXML(urls);
                const filename = `sitemap-${sitemapIndex}.xml`;
                fs.writeFileSync(path.join(__dirname, "public", filename), xml);
                sitemapFiles.push(filename);
                sitemapIndex++;
            }
        });

        // For uncategorized blogs
        const uncatBlogs = blogsByCat[null] || [];
        if (uncatBlogs.length > 0) {
            const urls = uncatBlogs.map((blog) => ({
                loc: `https://www.kaisoresearch.com/blog/${blog.url}`,
                changefreq: "weekly",
                priority: 0.7,
                lastmod: blog.updatedAt || new Date().toISOString(),
            }));
            const xml = generateXML(urls);
            const filename = `sitemap-${sitemapIndex}.xml`;
            fs.writeFileSync(path.join(__dirname, "public", filename), xml);
            sitemapFiles.push(filename);
            sitemapIndex++;
        }

        // For news categories
        newsCategories.forEach((category) => {
            const catArticles = articlesByCat[category._id] || [];
            if (catArticles.length > 0) {
                const urls = catArticles.map((article) => ({
                    loc: `https://www.kaisoresearch.com/news/${article.url}`,
                    changefreq: "weekly",
                    priority: 0.7,
                    lastmod: article.updatedAt || new Date().toISOString(),
                }));
                const xml = generateXML(urls);
                const filename = `sitemap-${sitemapIndex}.xml`;
                fs.writeFileSync(path.join(__dirname, "public", filename), xml);
                sitemapFiles.push(filename);
                sitemapIndex++;
            }
        });

        // Update the sitemap index
        const indexUrls = sitemapFiles
            .map((file) => `<sitemap><loc>https://www.kaisoresearch.com/${file}</loc><lastmod>${new Date().toISOString()}</lastmod></sitemap>`)
            .join("\n");
        const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexUrls}\n</sitemapindex>`;
        fs.writeFileSync(path.join(__dirname, "public", "sitemap.xml"), indexXml);

        // Specific disallow paths from existing logic
        const specificDisallowPaths = [
            "/admin/articles",
            "/admin/articles/blog-list-pages",
            "/admin/articles/domain",
            "/admin/career",
            "/admin/home",
            "/admin/inquires",
            "/admin/inquires/become-a-reseller",
            "/admin/inquires/checkouts",
            "/admin/inquires/contactus",
            "/admin/inquires/inquiry-before-buy",
            "/admin/inquires/need-customization",
            "/admin/inquires/other",
            "/admin/inquires/request-for-sample",
            "/admin/masters",
            "/admin/pages",
            "/admin/reports",
            "/admin/reports/domain",
            "/admin/reviews",
            "/admin/role",
            "/admin/role/adminform",
            "/admin/userprofile",
            "/auth",
            "/auth/back_to_login",
            "/auth/forgotpassword",
            "/auth/login",
            "/auth/setnewpassword",
            "/auth/verify_code",
        ];

        // New disallow paths from the provided rules
        const newDisallowPaths = [
            "/admin/",
            "/wp-admin/",
            "/cgi-bin/",
            "/cart/",
            "/checkout/",
            "/inquiry-before-buy",
            "/thank-you/",
            "/my-account/",
            "/login/",
            "/register/",
            "/tmp/",
            "/privacy-policy/",
            "/terms-conditions/",
            "/*?add-to-cart=",
            "/*?filter_",
        ];

        // Combine and deduplicate disallow paths
        const combinedDisallowPaths = [...new Set([...specificDisallowPaths, ...newDisallowPaths])];
        const specificDisallowLines = combinedDisallowPaths.map((p) => `Disallow: ${p}`).join("\n");

        // Generate robots.txt, excluding pages without generateMetadata and wildcard paths
        const filteredAllowPaths = allowPaths.filter(
            (p) => !excludedPaths.includes(p) && !combinedDisallowPaths.includes(p) && !["/*", "/*/*", "/*/*/*"].includes(p)
        );
        const allowLines = filteredAllowPaths.map((p) => `Allow: ${p}`).join("\n");

        // Generate sitemap URLs for robots.txt, including individual sitemaps and the sitemap index
        const sitemapUrls = [
            ...sitemapFiles.map((file) => `Sitemap: https://www.kaisoresearch.com/${file}`),
            "Sitemap: https://www.kaisoresearch.com/sitemap.xml", // Explicitly add sitemap index as requested
        ].join("\n");

        const robotsContent = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /wp-admin/
Disallow: /cgi-bin/
Disallow: /cart/
Disallow: /checkout/
Disallow: /inquiry-before-buy
Disallow: /thank-you/
Disallow: /my-account/
Disallow: /login/
Disallow: /register/
Disallow: /tmp/
Disallow: /privacy-policy/
Disallow: /terms-conditions/
Disallow: /*?add-to-cart=
Disallow: /*?filter_

Sitemap: https://www.kaisoresearch.com/sitemap.xml

# Sitemaps
${sitemapUrls}`;
        fs.writeFileSync(path.join(__dirname, "public", "robots.txt"), robotsContent);
        console.log("🤖 robots.txt generated successfully!");

        console.log("✅ All sitemaps generated successfully!");
        console.log(`📊 Generated ${sitemapFiles.length} sitemap files:`);
        sitemapFiles.forEach((file) => console.log(`   - ${file}`));
        console.log(`📈 Report categories processed: ${reportCategories.length}`);
        console.log(`📝 Blog categories processed: ${blogCategories.length}`);
        console.log(`📰 News categories processed: ${newsCategories.length}`);
    } catch (error) {
        console.error("Error generating sitemaps:", error);
    }
};

(async () => {
    await generateCategorySitemaps();
})();
