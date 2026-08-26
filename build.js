import fs from "fs";
import path from "path";
import { execSync } from 'child_process';

const root = process.cwd();


const targets = ["chrome", "firefox"];

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function mergeManifests(target) {
  const common = readJSON("manifest.common.json");
  const specific = readJSON(`manifest.${target}.json`);

  return {
    ...common,
    ...specific,
  };
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function build(target) {
  const outDir = path.join("build", target);

  fs.rmSync(outDir, { recursive: true, force: true });

  // Copier src + assets
  copyDir("src", outDir);
  copyDir("assets", path.join(outDir, "assets"));

  // Générer manifest
  const manifest = mergeManifests(target);
  writeJSON(path.join(outDir, "manifest.json"), manifest);
	
	// Zip Extension
	let stdout = execSync(`tar -a -cf ../${target}.zip *.*`, {
		cwd: `./build/${target}`
	});

  console.log(`Build ${target} terminé`);
}

targets.forEach(build);