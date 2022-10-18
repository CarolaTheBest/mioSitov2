
export type AlberoDocumenti = {
	type: "root";
	children: Capitolo[];
};

export interface Capitolo {
	type: "capitolo";
	data: CapitoloData;
	children: Documento[];
}


export interface Documento {
	type: "documento";
	data: DocumentoData;
	children: Esercizio[];
}

export interface DocumentoData {
	capitolo: string;
	titolo: string;
	url: string;
}

export interface CapitoloData {
	capitolo: string;
	titolo: string;
	url: string;
}

export interface Esercizio {
	type: "esercizi";
	data: EserciziData;
}

export interface EserciziData {
	titolo: string;
	capitoloRif: string;
	url: string
}
