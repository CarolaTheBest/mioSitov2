import orderBy from "lodash/orderBy";
import { u } from "unist-builder";
import type {
	AlberoDocumenti,
	Capitolo,
	Documento,
	DocumentoData,
	Esercizio
} from "../types/alberoAppunti";

export function creaListaDocumenti(
	documenti: documentoAstro[],
	esercizi: documentoAstro[]
): AlberoDocumenti {
	const albero: AlberoDocumenti = u("root", []); // Creo albero
	let documentiOrdinati = documenti;
	documenti.forEach((value) => {
		if (value.frontmatter.capitolo) {
			value.frontmatter.capitolo = value.frontmatter.capitolo.toString();
		} else {
			value.frontmatter.capitolo = "-1";
		}
	});
	documentiOrdinati = orderBy(documenti, "frontmatter.capitolo");
	const capitoliCapi = ritornoCapoCapitoli(documentiOrdinati);

	capitoliCapi.map((capitolo) => {
		const cap = ottieniCapitolo(capitolo);
		cap.children = ottieniDocumentiPerCapitolo(
			documenti,
			esercizi,
			capitolo.frontmatter.capitolo
		);
		albero.children.push(cap);
	});
	return albero;
}

function ritornoCapoCapitoli(documenti: documentoAstro[]): documentoAstro[] {
	let numeroPrecedente = 0;
	let numeroAttuale = 0;
	const capoCapitoli = [];
	for (let i = 0; i < documenti.length; i++) {
		const documento = documenti[i];
		numeroAttuale = parseInt(documento.frontmatter.capitolo);

		if (numeroAttuale != numeroPrecedente && numeroAttuale != -1) {
			numeroPrecedente = numeroAttuale;
			capoCapitoli.push(documento);
		}
	}
	return capoCapitoli;
}

function ottieniDocumentiPerCapitolo(
	documenti: documentoAstro[],
	esercizi: documentoAstro[],
	numeroCapitolo: string
): Documento[] {
	const ritorno: Documento[] = [];
	for (let index = 0; index < documenti.length; index++) {
		const documento: documentoAstro = documenti[index];
		if (parseInt(documento.frontmatter.capitolo) === parseInt(numeroCapitolo)) {
			const nodo: Documento = u(
				"documento",
				{
					data: {
						url: documento.url,
						capitolo: documento.frontmatter.capitolo.toString(),
						titolo: getHead1(documento),
					} as DocumentoData,
				},
				[]
			);
			nodo.children = ottieniEserciziPerDocumento(esercizi, nodo.data.capitolo);
			ritorno.push(nodo);
		}
	}

	return orderBy(ritorno, "data.capitolo", "asc");
}

function ottieniEserciziPerDocumento(
	documenti: documentoAstro[],
	numeroDocumento: string
): Esercizio[] {
	const ritorno: Esercizio[] = [];
	documenti.forEach((doc) => {
		if (doc.frontmatter.capitolo == numeroDocumento) {
			ritorno.push(
				u("esercizi", {
					data: {
						capitoloRif: doc.frontmatter.capitolo.toString(),
						titolo: getHead1(doc),
						url: doc.url,
					},
				})
			);
		}
	});
	return orderBy(ritorno, "data.capitolo", "asc");
}

function ottieniCapitolo(nodo: documentoAstro): Capitolo {
	return u(
		"capitolo",
		{
			data: {
				capitolo: nodo.frontmatter.capitolo.toString(),
				titolo: getHead1(nodo),
				url: nodo.url,
			},
		},
		[]
	);
}

function getHead1(nodo: documentoAstro): string {
	const risultati = (
		nodo.getHeadings() as { depth: number; text: string; slug: string }[]
	).filter((head) => head.depth == 1 && head.text);

	return risultati[0] ? risultati[0].text : "";
}

export type documentoAstro = Record<string, any>;
