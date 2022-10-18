import throttle from "lodash/throttle";
import { Component, MouseEvent, ReactNode } from "react";
import { muoviPagina } from "../../functions/muoviAllaPosizione";
import stile from "./sideBarHeading.module.scss";

interface headings {
  slug: string;
  depth: number;
  text: string;
}

export class SideBarHeadings extends Component<any, { headings: headings[] }> {
  precedente: HTMLElement | null = null;

  constructor(props: any) {
    super(props);
    this.state = { headings: [] };
  }

  cliccato(clickEvent: MouseEvent<HTMLAnchorElement>, destinazione: string) {
    clickEvent.preventDefault();
    const destinazioneLink = document.getElementById(destinazione);

    muoviPagina(destinazioneLink as HTMLElement);
  }

  componentDidMount(): void {
    const teste: headings[] = [];
    const headersRaw =
      document.querySelectorAll<HTMLHeadingElement>("h1, h2, h3");
    headersRaw.forEach((elemento) => {
      const testa: headings = {
        depth: parseInt(elemento.tagName.replace(/^\D+/g, "")),
        slug: elemento.id,
        text: elemento.innerHTML,
      };

      teste.push(testa);
    });

    this.setState({
      headings: teste,
    });

    window.addEventListener("scroll", throttle(this.scrolla, 500));
  }

  componentWillUnmount(): void {
    window.removeEventListener("scroll", this.scrolla);
  }

  scrolla() {
    const headers = document.querySelectorAll("h1, h2, h3");
    const filtrati = Array.prototype.slice.call(headers).filter((elem) => {
      return window.innerHeight / 2 - elem.getBoundingClientRect().top > 0;
    });
    const elemento = filtrati[filtrati.length - 1] as HTMLElement;

    const id = elemento?.id ?? "";
    const menu = document.querySelector(`*[href="#${id}"]`) as HTMLElement;

    if (this.precedente && this.precedente != menu) {
      this.precedente.removeAttribute("attivo");
    }
    this.precedente = menu;
    menu.setAttribute("attivo", "true");
  }

  render(): ReactNode {
    return (
      <div className={stile.wrapper}>
        {this.state.headings.map((head) => {
          return (
            <a
              key={head.slug}
              style={{ paddingLeft: `${head.depth - 1}em` }}
              onClick={(e) => this.cliccato(e, head.slug)}
              href={`#${head.slug}`}
            >
              <span dangerouslySetInnerHTML={{ __html: head.text }}></span>
            </a>
          );
        })}
      </div>
    );
  }
}
