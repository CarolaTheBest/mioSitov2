import { Component, createRef, ReactNode, RefObject } from "react";
import { interagisciConScorrimento } from "../../functions/interagisci";
import mia from "./immagini/mia.png";
import mole from "./immagini/mole.png";
import stile from "./stileaTorino.module.scss";

export class Atorino extends Component {
  ref: RefObject<any> = createRef();

  componentDidMount(): void {
    interagisciConScorrimento(
      { margini: 0 },
      (numero) => {
        if (this.ref.current) this.ref.current.style.transform = `rotate(${numero * 360}deg) `;
      },
      this.ref
    );
  }

  render(): ReactNode {
    return (
      <>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: "10rem", fontWeight: "bold", color: "black" }} className={stile.titolone}>
            A TORINO!
          </span>
          <span style={{ fontSize: "2rem" }}>Dove sono nato io!</span>

          <div className={stile.wrapper}>
            <img src={mia.src} ref={this.ref} className={`${stile.immagine} ${stile.sotto} ${stile.io}`} />
            <img src={mole.src} className={`${stile.immagine} ${stile.sotto}`} />
          </div>
        </div>
      </>
    );
  }
}
