import type { MarkdownHeading } from "astro";
import { Octokit } from "octokit";
import segreti from "../../segreti.json";
import type { PostPreviewType } from "../types/types";
//@ts-ignore
//@ts-ignore
import moment from "moment";
moment.locale("it");

function getTitolo(headings: MarkdownHeading[]): string {
  return (
    headings[headings.findIndex((head: any) => head.depth == 1)]?.text ?? "non ancora definito"
  );
}

export async function CreaArrayAppunti(
  cartella: Record<string, any>[]
): Promise<PostPreviewType[]> {
  const array: PostPreviewType[] = [];
  for await (const item of cartella) {
    const octokit = new Octokit({
      auth: segreti.tokenGithub,
    });

    let ultimaModifica = "";
    let ultimaModificaInNumeri = 0;

    if (import.meta.env.PROD) {
      const risposta = await octokit.request(
        `GET /repos/Proibito/miositov2/commits?path=src/pages${item.url}.mdx&page=1&per_page=1`,
        {
          owner: "Proibito",
          repo: "miositov2",
        }
      );

      if (risposta.data.length > 0) {
        const data = risposta.data[0].commit.author.date;
        const interpretaData = Date.parse(data);
        ultimaModificaInNumeri = interpretaData.valueOf();
        ultimaModifica = moment(interpretaData).format("DD MMMM YYYY");
      }
    }

    const elemento: PostPreviewType = {
      titolo: getTitolo(item.getHeadings()),
      frontmatter: item.frontmatter,
      url: item.url,
      ultimaModifica: ultimaModifica,
      ultimaModificaInNumeri: ultimaModificaInNumeri,
    };

    array.push(elemento);
  }
  return array;
}
