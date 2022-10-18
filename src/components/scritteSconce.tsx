import { Component, createRef, ReactNode, RefObject } from "react";
import stile from "./stileLettereSconce.module.scss";

export class ScritteSconce extends Component<
  { numeroLettere: number; prima?: string; dopo?: string },
  any
> {
  render(): ReactNode {
    return (
      <div style={{ display: "inline-flex" }}>
        {this.props.prima?.split("").map((el, indx) => (
          <span key={indx} className={stile.lettereSconce}>
            {el}
          </span>
        ))}
        {[...new Array(this.props.numeroLettere)].map((el, indx) => (
          <span className={stile.lettereSconce} key={indx}>
            <CaratteriSconci></CaratteriSconci>
          </span>
        ))}
        {this.props.dopo?.split("").map((el, indx) => (
          <span key={indx} className={stile.lettereSconce}>
            {el}
          </span>
        ))}
      </div>
    );
  }
}

class CaratteriSconci extends Component<any, { mostra: string }> {
  caratteri = ["$", "!", "*", "?", "☺", "♥", "&", "@", "€", "£"];
  intervallo!: ReturnType<typeof setTimeout>;
  ref: RefObject<HTMLSpanElement> = createRef();

  constructor(props: any) {
    super(props);
    this.state = { mostra: "@" };
  }

  componentDidMount(): void {
    this.intervallo = setInterval(() => {
      this.setState({ mostra: this.generaCarattereACaso() });
    }, 300);
  }

  componentWillUnmount(): void {
    clearInterval(this.intervallo);
  }

  generaCarattereACaso(): string {
    return this.caratteri[Math.floor(Math.random() * this.caratteri.length)];
  }

  render(): ReactNode {
    return (
      <span style={{ fontSize: "inherit", color: "inherit" }} ref={this.ref}>
        {this.state.mostra}
      </span>
    );
  }
}
