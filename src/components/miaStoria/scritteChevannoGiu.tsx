import { Component, createRef, ReactNode, RefObject } from "react";
import { interagisciConScorrimento, interagisciInvertito } from "../../functions/interagisci";
import aereo from "./immagini/aereo.svg";
import nuvola from "./immagini/nuvola.svg";
import stile from "./stile2.module.scss";

export class ScritteCheVannoGiu extends Component<any, any> {
  ref: RefObject<any> = createRef();
  aereo: RefObject<HTMLImageElement> = createRef();
  nuvola: RefObject<HTMLImageElement> = createRef();
  nuvola2: RefObject<HTMLImageElement> = createRef();
  refScritta: RefObject<HTMLImageElement> = createRef();

  constructor(props: any) {
    super(props);
    this.state = { opacita: 0 };
  }

  componentDidMount(): void {
    interagisciInvertito(
      { margini: 20 },
      (numero: number) => {
        this.setState({ opacita: numero });
      },
      this.ref
    );

    interagisciInvertito(
      { margini: 20 },
      (numero: number) => {
        if (this.refScritta.current) this.refScritta.current.style.opacity = `${numero}`;
      },
      this.refScritta
    );

    interagisciConScorrimento(
      { margini: 15 },
      (quanto) => {
        if (this.aereo.current) this.aereo.current.style.transform = `translateX(${quanto * 35}vw)`;
      },
      this.aereo
    );

    interagisciConScorrimento(
      { margini: 15 },
      (quanto) => {
        if (this.nuvola.current) this.nuvola.current.style.transform = `translateX(${quanto * 10}vw)`;
      },
      this.nuvola
    );

    interagisciConScorrimento(
      { margini: 15 },
      (quanto) => {
        if (this.nuvola2.current) this.nuvola2.current.style.transform = `translateX(-${quanto * 10}vw)`;
      },
      this.nuvola2
    );
  }

  render(): ReactNode {
    return (
      <>
        <div className={stile.wrapperScritte}>
          <div className="aereo" style={{ padding: "60vh 0" }}>
            <img
              ref={this.aereo}
              src={aereo}
              alt=""
              style={{ width: "40vw", maxWidth: "300px", filter: "brightness(0.75)" }}
            />
          </div>

          <div ref={this.nuvola} style={{ display: "inline-flex", padding: "20vh 0" }}>
            <img src={nuvola} alt="" style={{ width: "40vw", filter: "brightness(0.75)", marginLeft: "-10vw" }} />
            <img
              src={nuvola}
              alt=""
              style={{ width: "40vw", filter: "brightness(0.75)", transform: "translateX(-20%)" }}
            />
          </div>

          <div className={stile.scrittaWrappata}>
            <p ref={this.ref} className={stile.scritteGiu} style={{ opacity: this.state.opacita }}>
              Una bellssima frase che fa effetto e fa sempre figo mettere
            </p>
          </div>
          <div
            style={{ display: "flex", flexDirection: "row-reverse", transform: "translateX(74%)", paddingTop: "20rem" }}
          >
            <div ref={this.nuvola2} style={{ display: "inline-flex", padding: "20vh 0" }}>
              <img src={nuvola} alt="" style={{ width: "40vw", filter: "brightness(0.75)", marginLeft: "10vw" }} />
              <img
                src={nuvola}
                alt=""
                style={{ width: "40vw", filter: "brightness(0.75)", transform: "translateX(-25%)" }}
              />
              <img src={nuvola} alt="" style={{ width: "40vw", filter: "brightness(0.75)", marginLeft: "-100%" }} />
            </div>
          </div>

          <div className={stile.scrittaWrappata}>
            <p ref={this.refScritta} className={stile.scritteGiu} style={{ opacity: this.state.opacita }}>
              Tutto nasce qua sotto...
            </p>
          </div>
        </div>
        <div className={stile.aTorino}></div>
      </>
    );
  }
}
