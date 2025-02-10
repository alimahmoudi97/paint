import { ReactSVG } from "react-svg";
import svg from "../assets/svg/close-button.svg";
import pen from "../assets/svg/pen.svg";
import marker from "../assets/svg/marker.svg";
import highliter from "../assets/svg/highlighter.svg";
import eraser from "../assets/svg/eraser.svg";
import settingDraw from "../assets/svg/draw-setting.svg";
import selectMouse from "../assets/svg/select-mouse.svg";

function DrawMenu() {
  return (
    <div>
      <div>
        <button type="button" aria-label="Close">
          <ReactSVG src={svg} color="red" desc="Description" />
        </button>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <div title="Pen" role="button">
            <span aria-hidden="true" style={{ color: "rgb(5, 113, 211)" }}>
              <ReactSVG src={pen} className="w-28" />
            </span>
          </div>
          <div title="Marker" role="button">
            <span aria-hidden="true" style={{ color: "rgb(231, 25, 31)" }}>
              <ReactSVG src={marker} />
            </span>
          </div>
          <div title="Highlighter" role="button">
            <span aria-hidden="true" style={{ color: "rgb(255, 242, 52)" }}>
              <ReactSVG src={highliter} />
            </span>
          </div>
          <div title="Eraser" role="button">
            <span aria-hidden="true" style={{ color: "rgb(5, 113, 211)" }}>
              <ReactSVG src={eraser} />
            </span>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <button type="button" aria-pressed="false">
              <ReactSVG src={selectMouse} />
            </button>
            <button type="button" aria-label="Settings" aria-expanded="false">
              <ReactSVG src={settingDraw} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DrawMenu;
