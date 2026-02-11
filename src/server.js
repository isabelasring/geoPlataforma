const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const PAGES_DIR = path.join(PUBLIC_DIR, "pages");

app.disable("x-powered-by");

app.use(
  express.static(PUBLIC_DIR, {
    extensions: ["html"],
    maxAge: "1h",
    etag: true,
  })
);

// Also expose /public/pages at root so links like /about.html work.
app.use(
  express.static(PAGES_DIR, {
    extensions: ["html"],
    maxAge: "1h",
    etag: true,
  })
);

app.get("/", (_req, res) => {
  res.redirect(302, "/index.html");
});

app.get("/html/index.html", (_req, res) => {
  res.redirect(301, "/index.html");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`GeoPlataforma running on port ${PORT}`);
});
