const { parentPort } = require("worker_threads");
const { transpileModule, ModuleKind } = require("typescript");

parentPort.on("message", ({ args: [content, fileName], id }) => {
  const target = transpileModule(content, {
    fileName,
    compilerOptions: {
      module: ModuleKind.ESNext,
      sourceMap: true,
      inlineSourceMap: true,
      inlineSources: true,
    },
  });

  parentPort.postMessage({ id, result: target.outputText });
});
