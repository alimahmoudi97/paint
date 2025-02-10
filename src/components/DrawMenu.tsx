import { useState } from "react";
import { ReactSVG } from "react-svg";
import svg from "../assets/svg/close-button.svg";
import pen from "../assets/svg/pen.svg";
import marker from "../assets/svg/marker.svg";
import highliter from "../assets/svg/highlighter.svg";
import eraser from "../assets/svg/eraser.svg";
import settingDraw from "../assets/svg/draw-setting.svg";
import selectMouse from "../assets/svg/select-mouse.svg";
import { useContextCanvas } from "../context/Context";

function DrawMenu() {
  const { setContentState } = useContextCanvas();
  const [isPenClicked, setIsPenClicked] = useState("");

  const handlePenClick = (type: string) => {
    setIsPenClicked(type);
    if (type === "eraser") {
      setContentState((prev) => ({ ...prev, tool: type, brushType: type }));
      console.log("TYPE:", type);
    } else {
      setContentState((prev) => ({ ...prev, tool: "pen", brushType: type }));
    }
  };

  const handleSelectIcon = () => {
    setContentState((prev) => ({ ...prev, tool: "select", brushType: "" }));
  };

  return (
    <div>
      <div>
        <button type="button" aria-label="Close">
          <ReactSVG src={svg} color="red" desc="Description" />
        </button>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <div
            title="Pen"
            role="button"
            onClick={() => handlePenClick("pen")}
            className={`transform transition-transform duration-500 cursor-pointer ${
              isPenClicked === "pen" ? "translate-x-6" : ""
            }`}
          >
            <span aria-hidden="true" style={{ color: "rgb(5, 113, 211)" }}>
              <ReactSVG src={pen} className="w-28" />
            </span>
          </div>
          <div
            title="Marker"
            role="button"
            onClick={() => handlePenClick("marker")}
            className={`transform transition-transform duration-500 cursor-pointer ${
              isPenClicked === "marker" ? "translate-x-6" : ""
            }`}
          >
            <span aria-hidden="true" style={{ color: "rgb(231, 25, 31)" }}>
              <ReactSVG src={marker} className="w-28" />
            </span>
          </div>
          <div
            title="Highlighter"
            role="button"
            onClick={() => handlePenClick("highlighter")}
            className={`transform transition-transform duration-500 cursor-pointer ${
              isPenClicked === "highlighter" ? "translate-x-6" : ""
            }`}
          >
            <span aria-hidden="true" style={{ color: "rgb(255, 242, 52)" }}>
              <ReactSVG src={highliter} className="w-28" />
            </span>
          </div>
          <div
            title="Eraser"
            role="button"
            onClick={() => handlePenClick("eraser")}
            className={`transform transition-transform duration-500 cursor-pointer ${
              isPenClicked === "eraser" ? "translate-x-6" : ""
            }`}
          >
            <span aria-hidden="true" style={{ color: "rgb(5, 113, 211)" }}>
              <ReactSVG src={eraser} className="w-28" />
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <button
          type="button"
          onClick={handleSelectIcon}
          className="cursor-pointer flex justify-center hover:bg-blue-100"
        >
          <ReactSVG src={selectMouse} />
        </button>
        <button type="button" aria-label="Settings" aria-expanded="false">
          <ReactSVG src={settingDraw} />
        </button>
      </div>
    </div>
  );
}

export default DrawMenu;
