const http = require("http");
const fs = require("fs");
const path = require("path");
const { transpileModule, ModuleKind } = require("typescript");

const indexRoot = path.join(__dirname, "../demos");
http
  .createServer(function respond(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const lookupResults = lookupFile(path.join(process.cwd(), url.pathname), [
      ".ts",
      ".js",
      ".html",
    ]);

    const { content, fullPath, ext } = lookupResults;

    console.log(req.url, ext);

    if (ext === ".ts") {
      const target = transpileModule(content, {
        fileName: path.basename(fullPath),
        compilerOptions: {
          module: ModuleKind.ESNext,
          sourceMap: true,
          inlineSourceMap: true,
          inlineSources: true,
        },
      });
      sendContent(res, target.outputText, headersTypes.js);
    } else if (ext === ".js") {
      sendContent(res, content, headersTypes.js);
    } else if (ext === ".html") {
      sendContent(res, content, headersTypes.html);
    } else if (ext === ".css") {
      sendContent(res, content, headersTypes.css);
    } else {
      sendContent(res, createIndex(), headersTypes.html);
    }
  })
  .listen(8080, () => {
    console.log("Listening at http://localhost:8080");
  });

const headersTypes = {
  js: { "Content-Type": "application/javascript" },
  html: { "Content-Type": "text/html" },
  css: { "Content-Type": "text/css" },
};

function lookupFile(filePath, exts) {
  const stackTraceLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  try {
    if (fs.existsSync(filePath)) {
      return {
        fullPath: filePath,
        content: fs.readFileSync(filePath, "utf-8"),
        ext: path.extname(filePath),
      };
    }
    for (const ext of exts) {
      const fullPath = filePath + ext;
      if (fs.existsSync(fullPath)) {
        return {
          fullPath,
          content: fs.readFileSync(fullPath, "utf-8"),
          ext,
        };
      }
    }
  } catch (e) {
    // console.error(e);
  }
  Error.stackTraceLimit = stackTraceLimit;
  return { fullPath: filePath };
}

function createIndex() {
  const files = fs.readdirSync(indexRoot, {
    withFileTypes: true,
  });
  const paths = files
    .filter((file) => {
      return !file.isDirectory();
    })
    .map(({ name: fileName }) => {
      const name = path.parse(fileName).name;
      const href = `/demos/${name}`;
      return `<a href="${href}">${name}</a>`;
    });
  return `
      <style>body{font-family: monospace;} a {padding: 0.5em 1em;display:block}</style>
      <h2>Demos</h2>
      ${paths.join("")}
    `;
}

function sendContent(res, content, headers) {
  res.writeHead(200, headers);
  res.write(content);
  res.end();
}
