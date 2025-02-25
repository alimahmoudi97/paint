import { useEffect, useState } from "react";
import {
  FaCircle,
  FaLink,
  FaSquare,
  FaTextHeight,
  FaUpload,
} from "react-icons/fa";
import { FiTriangle } from "react-icons/fi";
import { RiApps2AddLine } from "react-icons/ri";
import { FaPencil } from "react-icons/fa6";
import DrawMenu from "./DrawMenu";
import { Image, Point, TEvent } from "fabric";
import { useContextCanvas } from "../hooks/useContextCanvas";
import Modal from "./Modal";
import { LuImport } from "react-icons/lu";
import { BiPolygon } from "react-icons/bi";
import { IoEllipse } from "react-icons/io5";
import { LiaNeos } from "react-icons/lia";
import { TbLine } from "react-icons/tb";

function Menu() {
  const { contentState, setContentState } = useContextCanvas();
  const [selectedShape, setSelectedShape] = useState("");
  const [isFillShape, setFillShape] = useState<boolean>(true);
  const [strokeWidth, setStrokeWidth] = useState<number>(1);

  const handleShapeBtn = (type: string) => {
    setContentState((prev) => ({
      ...prev,
      type,
      tool: "shape",
      // colorShape: selectedColor,
      strokeWidth,
      fillShape: isFillShape,
      // strokeColor: selectedColor,
    }));
    setSelectedShape(type);
  };

  const handleTextBtn = (event: React.MouseEvent<SVGElement>, tool: string) => {
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
    <div className="h-screen flex flex-col items-center p-4 gap-2 z-100 shadow-lg relative">
      <div
        className={`flex flex-col items-center justify-center p-1 cursor-pointer w-16 h-16 rounded-full relative bg-gray-100
        ${contentState.expandElementsMenu ? "text-green-500" : ""}`}
        onClick={handleElements}
      >
        <RiApps2AddLine className="w-8 h-8" />
        <span className="text-xs">Elements</span>
      </div>
      <div
        className={`absolute left-24 top-0 w-90  rounded-br
           rounded-tr bg-white transition-all duration-200 ease-in-out
           shadow shadow-gray-400
           flex flex-col pb-8
            ${
              contentState.expandElementsMenu
                ? "opacity-100 visible"
                : "opacity-0 invisible"
            }`}
      >
        <h2 className="text-2xl mb-6 text-black">Shapes</h2>
        <div className="flex flex-wrap gap-4 w-full">
          <button
            className={`py-2 px-4 rounded cursor-pointer ${
              selectedShape === "rectangle" ? "bg-green-500" : ""
            } hover:bg-green-500 text-white`}
            id="rectangle"
            onClick={() => handleShapeBtn("rectangle")}
          >
            <FaSquare
              className={`w-6 h-6 ${
                selectedShape === "rectangle" ? "text-white" : "text-blue-300"
              }`}
              fill="transparent"
              strokeWidth={32}
            />
          </button>
          <button
            className={`py-2 px-4 rounded cursor-pointer ${
              selectedShape === "circle" ? "bg-green-500" : ""
            } hover:bg-green-500 text-white`}
            id="circle"
            onClick={() => handleShapeBtn("circle")}
          >
            <FaCircle
              className={`w-6 h-6 ${
                selectedShape === "circle" ? "text-white" : "text-blue-300"
              }`}
              fill="transparent"
              strokeWidth={32}
            />
          </button>
          <button
            className={`py-2 px-4 rounded cursor-pointer ${
              selectedShape === "triangle" ? "bg-green-500" : ""
            } hover:bg-green-500 text-white`}
            id="triangle"
            onClick={() => handleShapeBtn("triangle")}
          >
            <FiTriangle
              className={`w-6 h-6 ${
                selectedShape === "triangle" ? "text-white" : "text-blue-300"
              }`}
              fill="transparent"
            />
          </button>
          <button
            className={`py-2 px-4 rounded cursor-pointer ${
              selectedShape === "line" ? "bg-green-500" : ""
            } hover:bg-green-500 text-white`}
            id="line"
            onClick={() => handleShapeBtn("line")}
          >
            <TbLine
              className={`w-6 h-6 ${
                selectedShape === "line" ? "text-white" : "text-blue-300"
              }`}
            />
          </button>
          <button
            className={`py-2 px-4 rounded cursor-pointer ${
              selectedShape === "ellipse" ? "bg-green-500" : ""
            } hover:bg-green-500 text-white`}
            id="ellipse"
            onClick={() => handleShapeBtn("ellipse")}
          >
            <IoEllipse
              className={`w-6 h-6 ${
                selectedShape === "ellipse" ? "text-white" : "text-blue-300"
              }`}
            />
          </button>
          <button
            className={`py-2 px-4 rounded cursor-pointer ${
              selectedShape === "polygon" ? "bg-green-500 text-white" : ""
            } hover:bg-green-500 text-white`}
            id="polygon"
            onClick={() => handleShapeBtn("polygon")}
          >
            <BiPolygon
              className={`w-6 h-6 ${
                selectedShape === "polygon" ? "text-white" : "text-blue-300"
              }`}
            />
          </button>
        </div>
      </div>
      <div
        className={`flex flex-col items-center justify-center cursor-pointer w-16 h-16 relative rounded-full bg-gray-100
            ${contentState.expandDrawMenu ? "text-green-600" : ""}`}
        onClick={handleDraw}
      >
        <FaPencil className="w-6 h-6" />
        <span className="text-xs">Draw</span>
      </div>
      <div
        className={`absolute left-24 top-0 py-8 rounded-br-2xl
           rounded-tr-2xl bg-white transition-all duration-200 ease-in-out
           shadow shadow-gray-400
           flex flex-col items-center
           
            ${
              contentState.expandDrawMenu
                ? "opacity-100 visible"
                : "opacity-0 invisible"
            }`}
      >
        <DrawMenu />
      </div>
      <div
        className={`flex flex-col items-center justify-center cursor-pointer w-16 h-16 rounded-full bg-gray-100
            ${contentState.tool === "text" ? "text-green-600" : ""}`}
      >
        <FaTextHeight
          className="w-6 h-6"
          onClick={(event) => handleTextBtn(event, "text")}
        />
        <span className="text-xs">Text</span>
      </div>
      <div
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gray-100
            ${contentState.tool === "import" ? "text-green-600" : ""}`}
      >
        <LuImport
          className="w-6 h-6"
          onClick={(event) => {
            handleTextBtn(event, "import");
            setContentState((prev) => ({
              ...prev,
              showModal: !contentState.showModal,
            }));
          }}
        />
        <span className="text-xs">Import</span>
        <Modal />
      </div>
    </div>
  );
}

export default Menu;
