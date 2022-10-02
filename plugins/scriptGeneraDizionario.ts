import { visit } from "unist-util-visit";
import { unified } from "unified";
import { join, relative } from "path";
import { writeFileSync, readdirSync, statSync } from "fs";
import { read } from "to-vfile";
import remarkParse from "remark-parse";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const array = {};
let posizioneAssolutaCorrente = "";
let posizioneRelativa = "";
await creaDizionario();
export async function creaDizionario() {
  const files = getAllFiles("E://Desktop//mioSitoV2//src//pages//appunti", []);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    posizioneAssolutaCorrente = file;
    posizioneRelativa = relative("E:/Desktop/mioSitoV2/src/pages", file);
    await unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(prendiIDati)
      .use(remarkRehype as any)
      .use(rehypeStringify)
      .process(await read(file));
  }

  esportaJSON(array);
  console.log("\x1b[42m%s\x1b[0m","Dizionario generato");
}

function esportaJSON(oggetto) {
  const data = JSON.stringify(oggetto);
  writeFileSync("dizionario.json", data);
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (statSync(dirPath + "/" + file).isDirectory()) {
      return getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith("mdx")) arrayOfFiles.push(join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

function prendiIDati() {
  return (tree) => {
    visit(tree, "textDirective", (node) => {
      if (node.name == "d") {
        array[node.children[0].value] = {
          posizioneAssoluta: posizioneAssolutaCorrente,
          posizioneRelativa: posizioneRelativa.replace(/\.[^/.]+$/, ""),
          parola: node.children[0].value
        };
      }
    });
  };
}
