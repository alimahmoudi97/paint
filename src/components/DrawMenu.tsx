import { useState } from "react";
import { ReactSVG } from "react-svg";
import pen from "../assets/svg/pen.svg";
import marker from "../assets/svg/marker.svg";
import highliter from "../assets/svg/highlighter.svg";
import { useContextCanvas } from "../hooks/useContextCanvas";

function DrawMenu() {
  const { setContentState } = useContextCanvas();
  const [isPenClicked, setIsPenClicked] = useState("");

  const handlePenClick = (type: string) => {
    setIsPenClicked(type);
    if (type === "eraser") {
      setContentState((prev) => ({ ...prev, tool: type, brushType: type }));
    } else {
      setContentState((prev) => ({ ...prev, tool: "pen", brushType: type }));
    }
  };

  return (
    <div>
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
        </div>
      </div>
    </div>
  );
}

export default DrawMenu;
