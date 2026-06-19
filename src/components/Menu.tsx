import { useEffect, useState } from "react";
import { FaCircle, FaSquare, FaTextHeight } from "react-icons/fa";
import { FiTriangle } from "react-icons/fi";
import { RiApps2AddLine } from "react-icons/ri";
import { FaPencil } from "react-icons/fa6";
import type { IconType } from "react-icons";
import DrawMenu from "./DrawMenu";
import { Point, TEvent } from "fabric";
import { useContextCanvas } from "../hooks/useContextCanvas";
import Modal from "./Modal";
import { LuImport } from "react-icons/lu";
import { BiPolygon } from "react-icons/bi";
import { IoEllipse } from "react-icons/io5";
import { TbLine } from "react-icons/tb";

const shapeOptions: { id: string; label: string; icon: IconType }[] = [
  { id: "rectangle", label: "Rectangle", icon: FaSquare },
  { id: "circle", label: "Circle", icon: FaCircle },
  { id: "triangle", label: "Triangle", icon: FiTriangle },
  { id: "line", label: "Line", icon: TbLine },
  { id: "ellipse", label: "Ellipse", icon: IoEllipse },
  { id: "polygon", label: "Polygon", icon: BiPolygon },
];

const navItemBase =
  "flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-2xl cursor-pointer transition-all duration-200 select-none";
const navItemActive =
  "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105";
const navItemInactive =
  "text-gray-500 hover:bg-purple-50 hover:text-purple-500";

const panelBase =
  "absolute left-24 top-0 rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-gray-300/50 transition-all duration-200 ease-out p-5";
const panelHidden = "opacity-0 invisible -translate-x-2 scale-95";
const panelVisible = "opacity-100 visible translate-x-0 scale-100";

function Menu() {
  const { contentState, setContentState } = useContextCanvas();
  const [selectedShape, setSelectedShape] = useState("");
  const [isFillShape] = useState<boolean>(true);
  const [strokeWidth] = useState<number>(1);

  const handleShapeBtn = (type: string) => {
    setContentState((prev) => ({
      ...prev,
      type,
      tool: "shape",
      strokeWidth,
      fillShape: isFillShape,
    }));
    setSelectedShape(type);
  };

  const handleTextBtn = (event: React.MouseEvent, tool: string) => {
    event.stopPropagation();
    setContentState((prev) => ({ ...prev, tool }));
  };

  const handleElements = () => {
    setContentState((pre) => ({
      ...pre,
      expandDrawMenu: false,
      expandElementsMenu: !contentState.expandElementsMenu,
    }));
  };

  const handleDraw = () => {
    setContentState((pre) => ({
      ...pre,
      expandDrawMenu: !contentState.expandDrawMenu,
      expandElementsMenu: false,
    }));
  };

  const handleMouseWheel = (opt: TEvent<WheelEvent>) => {
    const canvas = contentState.canvas;
    if (!canvas) return;
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint(new Point(opt.e.offsetX, opt.e.offsetY), zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  };

  const handleColseExpanedMenu = () => {
    setContentState((prev) => ({
      ...prev,
      expandDrawMenu: false,
      expandElementsMenu: false,
    }));
  };

  useEffect(() => {
    const canvas = contentState.canvas;
    if (canvas) {
      canvas.on("mouse:wheel", handleMouseWheel);
      canvas.on("mouse:down", handleColseExpanedMenu);
    }

    return () => {
      if (canvas) {
        canvas.off("mouse:wheel", handleMouseWheel);
        canvas.off("mouse:down", handleColseExpanedMenu);
      }
    };
  }, [contentState.canvas]);

  return (
    <div className="h-screen flex flex-col items-center py-4 px-3 gap-3 z-100 bg-white border-r border-gray-100 shadow-sm relative">
      <div
        title="Shapes"
        className={`${navItemBase} ${
          contentState.expandElementsMenu ? navItemActive : navItemInactive
        }`}
        onClick={handleElements}
      >
        <RiApps2AddLine className="w-6 h-6" />
        <span className="text-[10px] font-medium">Shapes</span>
      </div>
      <div
        className={`${panelBase} w-72 ${
          contentState.expandElementsMenu ? panelVisible : panelHidden
        }`}
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <RiApps2AddLine className="text-purple-500 w-5 h-5" />
          Shapes
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {shapeOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              title={label}
              className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedShape === id
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white border-transparent shadow-lg shadow-purple-500/30"
                  : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-purple-50 hover:text-purple-500 hover:border-purple-200"
              }`}
              onClick={() => handleShapeBtn(id)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        title="Draw"
        className={`${navItemBase} ${
          contentState.expandDrawMenu ? navItemActive : navItemInactive
        }`}
        onClick={handleDraw}
      >
        <FaPencil className="w-5 h-5" />
        <span className="text-[10px] font-medium">Draw</span>
      </div>
      <div
        className={`${panelBase} flex flex-col items-stretch ${
          contentState.expandDrawMenu ? panelVisible : panelHidden
        }`}
      >
        <h2 className="text-lg font-bold text-gray-800 mb-3">Drawing Tools</h2>
        <DrawMenu />
      </div>

      <div
        title="Text"
        className={`${navItemBase} ${
          contentState.tool === "text" ? navItemActive : navItemInactive
        }`}
        onClick={(event) => handleTextBtn(event, "text")}
      >
        <FaTextHeight className="w-5 h-5" />
        <span className="text-[10px] font-medium">Text</span>
      </div>

      <div
        title="Import"
        className={`${navItemBase} relative ${
          contentState.tool === "import" ? navItemActive : navItemInactive
        }`}
        onClick={(event) => {
          handleTextBtn(event, "import");
          setContentState((prev) => ({
            ...prev,
            showModal: !contentState.showModal,
          }));
        }}
      >
        <LuImport className="w-5 h-5" />
        <span className="text-[10px] font-medium">Import</span>
        <Modal />
      </div>
    </div>
  );
}

export default Menu;
