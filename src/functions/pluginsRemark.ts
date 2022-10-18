import { readFileSync } from "fs";
import { h } from "hastscript";
import uniq from "lodash/uniq";
import { link, text } from "mdast-builder";
import { toHast } from "mdast-util-to-hast";
import slash from "slash";
import { filter } from "unist-util-filter";
import { visit } from "unist-util-visit";
import { visitParents } from "unist-util-visit-parents";

const rawdata = readFileSync("dizionario.json");
const dizionario = JSON.parse(rawdata as any);

export function ottieniDescrizione() {
	return function (tree: any, { data }: { data: any }) {
		let testoDaRitornare = "";
		visit(tree, "paragraph", (paragrafi) => {
			for (const figlio of paragrafi.children) {
				if (testoDaRitornare.length > 150) return;
				if (figlio.type === "text") testoDaRitornare += figlio.value;
			}
		});
		data.astro.frontmatter.descrizione = testoDaRitornare;
	};
}

export function ottieniSimboli() {
	return function (tree: any, { data }: { data: any }) {
		const matematica: string[] = [];
		visit(tree, "inlineMath", (paragrafi) => {
			matematica.push(paragrafi.value);
		});
		data.astro.frontmatter.formule = uniq(matematica);
	};
}

export function boxDefinizione() {
	return (tree: any) => {
		visit(tree, "containerDirective", (node) => {
			switch (node.name) {
				case "def":
					ritornaBox(
						"definizione",
						"https://cdn.betterttv.net/emote/5d63e543375afb1da9a68a5a/2x",
						node
					);
					break;

				case "att":
					ritornaBox(
						"attenzione",
						"https://cdn.betterttv.net/emote/56e9f494fff3cc5c35e5287e/2x",
						node
					);
					break;

				case "nb":
					ritornaBox(
						"notaBene",
						"https://cdn.betterttv.net/emote/5e2914861df9195f1a4cd411/2x",
						node,
						"Nota Bene"
					);
					break;
			}
		});
	};
}

export function cambioTextDirectives() {
	// @ts-ignore
	return (tree) => {
		visit(tree, "textDirective", (node) => {
			if (node.name === "d") {
				const valore = node.children[0].value;
				const data = node.data || (node.data = {});
				const tagName = "span";
				data.hName = tagName;
				data.hProperties = h(".inizioDefinizione", {
					id: `${valore}-def`,
				}).properties;
			}
		});
	};
}

function ritornaBox(
	nome: string,
	urlImmagine: string,
	node: any,
	nomeDaVisualizzare?: string
) {
	const data = node.data || (node.data = {});
	const tagName = "div";
	data.hName = tagName;
	const containerDefinizione = h(`.contenuto${nome}`, []);
	for (const child of node.children) {
		containerDefinizione.children.push(toHast(child) as any);
	}

	data.hProperties = h(`div.${nome}Container`, {
		class: ["conteinerSpegazioni"],
	}).properties;
	data.hChildren = h(`div.${nome}Wraper`, [
		h(`.boxIntestazione${nome}`, { class: ["intestazioneSpiegazione"] }, [
			h("span", nomeDaVisualizzare ?? nome),
			h(`img.immagineIntestazione${nome}`, {
				src: urlImmagine,
			}),
		]),
		containerDefinizione,
	]).children;
}

export function codiceInline() {
	return (tree: any) => {
		visit(tree, "inlineCode", (node) => {
			const data = node.data || (node.data = {});
			data.hProperties = h(".codeInline").properties;
		});
	};
}

// TODO aggiungere l'auto layout

export function nascondiTestata() {
	return (tree: any, data: { data: any }) => {
		return filter(tree, (node: any) => node.tagName !== "h1");
	};
}

export function lazyLoadingImmagini() {
	return (tree: any) => {
		visit(tree, "element", (node) => {
			if (node.tagName == "img") {
				node.properties.loading = "lazy";
			}
		});
	};
}

export function aggiungiDizionario() {
	return (tree: any) => {
		visitParents(tree, "text", (node, ancestor) => {
			const stringa = node.value;

			if (ancestor[ancestor.length - 1].type === "textDirective") {
				return node;
			}

			Object.keys(dizionario).forEach(function (key) {
				const posizione = node.value.search(key);
				const lunghezzaStringa = key.length;
				if (posizione > -1 && !node.creato) {
					const prima = stringa.slice(0, posizione);
					const seconda = stringa.slice(posizione + lunghezzaStringa);
					const appendiQui = ancestor[ancestor.length - 1].children;

					const posizioneElArray = appendiQui.findIndex(
						(el: any) => el === node
					);
					node.value = prima;
					const valore = dizionario[key].posizioneRelativa.toString();

					appendiQui.insert(
						posizioneElArray + 1,
						creaTree(key, "link", true, `/${slash(valore)}#${key}-def`)
					);
					appendiQui.insert(
						posizioneElArray + 2,
						creaTree(seconda, "text", false)
					);
				}
			});
		});
	};
}

declare global {
	interface Array<T> {
		insert(array: T, index: number, ...items: any[]): void;
	}
}

Array.prototype.insert = function (index, ...items) {
	this.splice(index, 0, ...items);
};

function creaTree(testo: string, tipo: string, creato: boolean, url = "") {
	if (tipo != "link") {
		return {
			type: tipo,
			value: testo,
			creato,
		};
	} else {
		const testoMd = text(testo);
		const linkMD = link(url, testo, [testoMd]);
		// @ts-ignore
		testoMd.creato = true;
		return linkMD;
	}
}
