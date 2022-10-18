import React, { Component, RefObject } from "react";
import { topBarImpostazioni } from "../../settings/topBar";
import stile from "./ElementiTopBar.module.scss";

export class ElementiTopBar extends Component {
  muoviDiv: RefObject<HTMLDivElement>;
  items: RefObject<any>;

  constructor(props: any) {
    super(props);

    this.muoviDiv = React.createRef();
    this.items = React.createRef();
  }

  render() {
    return (
      <div className={stile.wrapper}>
        <div className={`${stile.muovi} ${stile.comune}`} ref={this.muoviDiv}></div>
        <div ref={this.items}></div>
        {topBarImpostazioni.elementiSinistra.map((elemento, index) => (
          <a
            href={elemento.link}
            key={index}
            ref={(elemento) => {
              if (this.items.current) {
                this.items.current[index] = elemento;
              }
            }}
            onMouseEnter={(evento) => this.mouseEntrato(evento as any)}
            onMouseOut={() => this.togli()}
            className={`${stile.bottoni}  ${stile.comune}`}
          >
            {elemento.testo}
          </a>
        ))}
      </div>
    );
  }

  mouseEntrato(evento: React.MouseEvent<HTMLButtonElement>) {
    const posizione = evento.currentTarget.getBoundingClientRect();
    if (this.muoviDiv.current) {
      const stile = this.muoviDiv.current.style;
      stile.opacity = "1";
      stile.width = `${posizione.width}px`;
      stile.height = `${posizione.height}px`;
      stile.transform = `translateX(${posizione.left}px)`;
    }
  }

  componentDidMount(): void {
    if (this.muoviDiv.current) {
      const stile = this.muoviDiv.current.style;
      const posizione = this.items.current[0] as HTMLDivElement;
      stile.transform = `translateX(${posizione.getBoundingClientRect().left}px)`;
    }
  }

  togli() {
    if (this.muoviDiv.current) this.muoviDiv.current.style.opacity = "0";
  }
}
