import { tailTornado } from "../glitchText/tailTornado";
import "./spinner.scss";

const Spinner = () => {
  return <div className={"ball " + tailTornado()} />;
};

export default Spinner;
