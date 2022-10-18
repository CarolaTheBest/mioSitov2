import pickBy from "lodash/pickBy";
import values from "lodash/values";
import { Component, createRef, ReactNode, RefObject } from "react";
import dizionario from "../../../dizionario.json";
import { PortalNav } from "../hambugerMobile/hamburgerMobile";
import stile from "./ricercaAppunti.module.scss";

export class RicercaAppunti extends Component<any, { visibile: boolean }> {
  constructor(props) {
    super(props);
    this.state = { visibile: false };
  }

  chiudi() {
    this.setState({ visibile: false });
  }

  render(): ReactNode {
    return (
      <>
        <div
          style={{ display: "flex" }}
          onClick={() => {
            this.setState({ visibile: true });
          }}
        >
          <Lente></Lente>
        </div>
        {this.state.visibile ? (
          <PortalNav>
            <BoxRicerca chiudi={() => this.chiudi()}></BoxRicerca>
          </PortalNav>
        ) : null}
      </>
    );
  }
}

function Lente(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      style={{ width: "30px", height: "30px" }}
    >
      <path d="M39.8 41.95 26.65 28.8q-1.5 1.3-3.5 2.025-2 .725-4.25.725-5.4 0-9.15-3.75T6 18.75q0-5.3 3.75-9.05 3.75-3.75 9.1-3.75 5.3 0 9.025 3.75 3.725 3.75 3.725 9.05 0 2.15-.7 4.15-.7 2-2.1 3.75L42 39.75Zm-20.95-13.4q4.05 0 6.9-2.875Q28.6 22.8 28.6 18.75t-2.85-6.925Q22.9 8.95 18.85 8.95q-4.1 0-6.975 2.875T9 18.75q0 4.05 2.875 6.925t6.975 2.875Z" />
    </svg>
  );
}

function Chiudi() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      style={{ width: "30px", height: "30px" }}
    >
      <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" />
    </svg>
  );
}

class BoxRicerca extends Component<
  { chiudi: any },
  { ricerca: string; risultati: any[] }
> {
  elmentiDaCercare = dizionario;
  ref: RefObject<HTMLInputElement> = createRef();

  constructor(props: any) {
    super(props);

    this.state = {
      ricerca: "",
      risultati: [],
    };
  }

  ricerca(parolaCercata: string) {
    if (parolaCercata == "") {
      this.setState({ risultati: [] });
      return;
    }
    const risultati = values(
      pickBy(this.elmentiDaCercare, (el) => {
        return el.parola.includes(parolaCercata);
      })
    );
    this.setState({ risultati: risultati, ricerca: parolaCercata });
  }

  render(): ReactNode {
    return (
      <div
        className={stile.wrapper}
        onClick={(evento) => {
          if (evento.currentTarget == evento.target) this.props.chiudi();
        }}
      >
        <div className={stile.ricerca}>
          <div className={stile.chiudi}>
            <span className={stile.titoloBox}>Ricerca una parola chiave</span>
            <div className={stile.icona} onClick={this.props.chiudi}>
              <Chiudi />
            </div>
          </div>
          <div className={stile.barraRicerca}>
            <Lente></Lente>
            <input
              ref={this.ref}
              type="text"
              name="ricercaDocumento"
              onChange={(event) => this.ricerca(event.target.value)}
            />
            {this.state.ricerca != "" ? (
              <div
                style={{ display: "flex" }}
                onClick={() => {
                  this.setState({ ricerca: "" });
                  this.ref.current.value = "";
                  this.ricerca("");
                }}
              >
                <Chiudi></Chiudi>
              </div>
            ) : null}
          </div>
          <hr />
          <Risultati risultati={this.state.risultati}></Risultati>
        </div>
      </div>
    );
  }
}

class Risultati extends Component<{ risultati: any[] }> {
  render(): ReactNode {
    return (
      <>
        <span>Risultati</span>
        <div className={stile.wrapperRisultati}>
          {this.props.risultati.map((ris, indx) => (
            <a
              href={`\\${ris.posizioneRelativa}`}
              key={indx}
              className={stile.elementoRisultato}
            >
              <span>{ris.parola}</span>
            </a>
          ))}
        </div>
      </>
    );
  }
}
