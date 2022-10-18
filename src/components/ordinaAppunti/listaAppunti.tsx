import orderBy from "lodash/orderBy";
import { Component, ReactNode } from "react";
import type { PostPreviewType } from "../../types/types";
import {
    OrdinaAppunti,
    OrdinamentoOpzioni,
    OrdinamentoStringa
} from "./ordinaAppunti";
import { SingoloAppunto } from "./singoloAppunto";

export class ListaAppunti extends Component<
  { posts: PostPreviewType[] },
  { posts: PostPreviewType[] }
> {
  // grazie Prettier
  constructor(props: any) {
    super(props);
    this.state = { posts: this.props.posts };
  }

  cambiato(opzioni: OrdinamentoOpzioni) {
    let post: PostPreviewType[] = this.state.posts;
    // Ordinamento appunti logica
    switch (opzioni.tipoDiOrdinamento) {
      case OrdinamentoStringa.alfabetico:
        post = orderBy(
          this.state.posts,
          (o) => o.titolo.toLowerCase(),
          opzioni.crescente ? "asc" : "desc"
        );
        break;

      case OrdinamentoStringa.dataDiModifica:
        post = orderBy(
          this.state.posts,
          "ultimaModificaInNumeri",
          !opzioni.crescente ? "asc" : "desc"
        );
        break;

      case OrdinamentoStringa.importanza:
        post = orderBy(
          this.state.posts,
          "frontmatter.capitolo",
          opzioni.crescente ? "asc" : "desc"
        );
        break;
    }

    this.setState({ posts: post });
  }

  componentDidMount(): void {
    this.cambiato({
      tipoDiOrdinamento: OrdinamentoStringa.importanza,
      crescente: true,
    });
  }

  render(): ReactNode {
    return (
      <div>
        <div className="impostazioni">
          <OrdinaAppunti cambio={(ev) => this.cambiato(ev)} />
        </div>
        <div className="appunti">
          {this.state.posts.map((appunto, indx) => (
            <SingoloAppunto key={indx} post={appunto} />
          ))}
        </div>
      </div>
    );
  }
}
