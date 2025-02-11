import { useEffect, useState } from "react";
import { useContextCanvas } from "../context/Context";
import {
  FaCircle,
  FaEraser,
  FaExpand,
  FaPen,
  FaSearchMinus,
  FaSearchPlus,
  FaSquare,
  FaStop,
  FaTextHeight,
  FaUndo,
  FaVideo,
} from "react-icons/fa";
import { FiMousePointer, FiTriangle } from "react-icons/fi";
import { RiApps2AddLine } from "react-icons/ri";
import { FaPencil } from "react-icons/fa6";
import DrawMenu from "./DrawMenu";
import { Point, TEvent } from "fabric";
import useCanvasRecorder from "../hooks/useCanvasRecorder";

function Menu() {
  const { contentState, setContentState } = useContextCanvas();
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedColor, setSelectedColor] = useState("red");
  const [isFillShape, setFillShape] = useState<boolean>(true);
  const [strokeWidth, setStrokeWidth] = useState<number>(1);
  const { startRecording, stopRecording, recording, videoURL } =
    useCanvasRecorder();

  const handleShapeBtn = (type: string) => {
    setContentState((prev) => ({
      ...prev,
      type,
      tool: "shape",
      colorShape: selectedColor,
      strokeWidth,
      fillShape: isFillShape,
      strokeColor: selectedColor,
    }));
    setSelectedShape(type);
  };

  const handleDrawBtn = (type: string) => {
    setContentState((prev) => ({
      ...prev,
      type,
      tool: "tools",
      colorShape: selectedColor,
      strokeWidth,
      fillShape: isFillShape,
      strokeColor: selectedColor,
    }));
    setSelectedShape(type);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setContentState((prev) => ({
      ...prev,
      colorShape: color,
      strokeColor: color,
      tool: "color",
      type: "draw",
    }));
  };

  const handleFillShapeChange = () => {
    setFillShape(!isFillShape);
  };

  const handleStrokeWidthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStrokeWidth(Number(event.target.value));
  };

  const handlePenBtn = (
    event: React.MouseEvent<HTMLButtonElement>,
    tool: string
  ) => {
    event.stopPropagation();
    setContentState((prev) => ({
      ...prev,
      tool,
    }));
    console.log("Ali");
  };

  const handleExport = () => {
    if (contentState.canvas) {
      const dataURL = contentState.canvas.toDataURL({
        format: "png",
        quality: 1.0,
        multiplier: 1,
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas.png";
      link.click();
    }
  };

  const handleEraserBtn = (
    event: React.MouseEvent<HTMLButtonElement>,
    tool: string
  ) => {
    event.stopPropagation();
    setContentState((prev) => ({ ...prev, tool }));
  };

  const handleTextBtn = (event: React.MouseEvent<SVGElement>, tool: string) => {
    event.stopPropagation();
    setContentState((prev) => ({ ...prev, tool }));
  };

  const handleSelectBtn = (
    event: React.MouseEvent<HTMLButtonElement>,
    tool: string
  ) => {
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

  const handleZoomOut = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom / 1.1);
  };

  const handleZoomIn = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom * 1.1);
  };

  const handleFit = () => {
    const canvas = contentState.canvas;
    if (canvas) {
      const objects = canvas.getObjects();
      if (objects.length > 0) {
        const boundingRect = canvas.getActiveObject()?.getBoundingRect() || {
          width: canvas.width,
          height: canvas.height,
        };
        const scaleX = canvas.width / boundingRect.width;
        const scaleY = canvas.height / boundingRect.height;
        const scale = Math.min(scaleX, scaleY);
        canvas.setZoom(scale);
        canvas.viewportTransform = [scale, 0, 0, scale, 0, 0];
        canvas.renderAll();
      }
    }
  };

  const handleResetZoom = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.renderAll();
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

  useEffect(() => {
    const canvas = contentState.canvas;
    if (canvas) {
      canvas.on("mouse:wheel", handleMouseWheel);
    }

    return () => {
      if (canvas) {
        canvas.off("mouse:wheel", handleMouseWheel);
      }
    };
  }, [contentState.canvas]);
  useEffect(() => {
    const canvas = contentState.canvas;

    const handleObjectSelected = () => {
      if (contentState.tool === "eraser") return;
      const activeObject = canvas?.getActiveObject();
      if (activeObject) {
        activeObject.set({
          fill: isFillShape ? selectedColor : "transparent",
          stroke: selectedColor,
          strokeWidth,
        });

        canvas?.renderAll();
      }
    };

    canvas?.on("selection:created", handleObjectSelected);
    canvas?.on("selection:updated", handleObjectSelected);

    return () => {
      canvas?.off("selection:created", handleObjectSelected);
      // canvas?.off("selection:updated", handleObjectSelected);
    };
  }, [contentState]);
  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col items-center p-4 z-100 shadow-lg relative">
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={handleElements}
      >
        <RiApps2AddLine className="w-9 h-9" />
        <span className="text-base mb-6">Elements</span>
      </div>
      <div
        className={`absolute left-40 top-0 bottom-0 w-90 z-999999 border rounded-br-2xl
           rounded-tr-2xl bg-white transition-all duration-200 ease-in-out
           shadow shadow-blue-500
           flex flex-col items-center
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
              selectedShape === "rectangle" ? "bg-green-500" : "bg-gray-700"
            } hover:bg-green-500 text-white`}
            id="rectangle"
            onClick={() => handleShapeBtn("rectangle")}
          >
            <FaSquare />
          </button>
          <button
            className={`py-2 px-4 rounded cursor-pointer ${
              selectedShape === "circle" ? "bg-green-500" : "bg-gray-700"
            } hover:bg-green-500 text-white`}
            id="circle"
            onClick={() => handleShapeBtn("circle")}
          >
            <FaCircle />
          </button>
          <button
            className={`py-2 px-4 rounded cursor-pointer ${
              selectedShape === "triangle" ? "bg-green-500" : "bg-gray-700"
            } hover:bg-green-500 text-white`}
            id="triangle"
            onClick={() => handleShapeBtn("triangle")}
          >
            <FiTriangle />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 w-full text-black">
          <h2 className="text-xl mt-6 mb-4">Change fill shape</h2>
          <input
            type="checkbox"
            checked={isFillShape}
            onChange={handleFillShapeChange}
            className="w-4 h-4"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 w-full text-black">
          <h2 className="text-xl mt-6 mb-4">Stroke Width</h2>
          <input
            type="range"
            min="1"
            max="10"
            value={strokeWidth}
            onChange={handleStrokeWidthChange}
          />
          <span>{strokeWidth}</span>
        </div>
      </div>
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={handleDraw}
      >
        <FaPencil className="w-9 h-9" />
        <span className="text-base mb-6">Draw</span>
      </div>
      <div
        className={`absolute left-40 top-0 py-8 border rounded-br-2xl
           rounded-tr-2xl bg-white transition-all duration-200 ease-in-out
           shadow shadow-blue-500
           flex flex-col items-center
           
            ${
              contentState.expandDrawMenu
                ? "opacity-100 visible"
                : "opacity-0 invisible"
            }`}
      >
        <DrawMenu />
      </div>
      <div className="flex flex-col items-center cursor-pointer">
        <FaTextHeight
          className="w-9 h-9"
          onClick={(event) => handleTextBtn(event, "text")}
        />
        <span className="text-base mb-6">Elements</span>
      </div>
      <div className="flex flex-col items-center gap-4 mt-6">
        <button
          className="text-base py-2 px-1 rounded cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
          onClick={handleZoomIn}
        >
          <FaSearchPlus />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
          onClick={handleZoomOut}
        >
          <FaSearchMinus />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
          onClick={handleFit}
        >
          <FaExpand />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
          onClick={handleResetZoom}
        >
          <FaUndo />
        </button>
      </div>
      <button
        className="text-base py-2 px-1 mt-6 rounded cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
        onClick={handleExport}
      >
        Export as Image
      </button>
      <div className="flex flex-col items-center gap-4 mt-6">
        {recording ? (
          <button
            className="text-base py-2 px-1 rounded cursor-pointer bg-red-500 hover:bg-red-700 text-white"
            onClick={stopRecording}
          >
            <FaStop />
          </button>
        ) : (
          <button
            className="text-base py-2 px-1 rounded cursor-pointer bg-green-500 hover:bg-green-700 text-white"
            onClick={startRecording}
          >
            <FaVideo />
          </button>
        )}
        {videoURL && (
          <a
            href={videoURL}
            download="canvas-recording.webm"
            className="text-base py-2 px-1 rounded cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
          >
            Download Video
          </a>
        )}
      </div>
    </div>
  );
}

export default Menu;
