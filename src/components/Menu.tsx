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

function Menu() {
  const { contentState, setContentState } = useContextCanvas();
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedColor] = useState("red");
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

  // const handleDrawBtn = (type: string) => {
  //   setContentState((prev) => ({
  //     ...prev,
  //     type,
  //     tool: "tools",
  //     colorShape: selectedColor,
  //     strokeWidth,
  //     fillShape: isFillShape,
  //     strokeColor: selectedColor,
  //   }));
  //   setSelectedShape(type);
  // };

  // const handleColorChange = (color: string) => {
  //   setSelectedColor(color);
  //   setContentState((prev) => ({
  //     ...prev,
  //     colorShape: color,
  //     strokeColor: color,
  //     tool: "color",
  //     type: "draw",
  //   }));
  // };

  const handleFillShapeChange = () => {
    setFillShape(!isFillShape);
  };

  const handleStrokeWidthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStrokeWidth(Number(event.target.value));
  };

  // const handlePenBtn = (
  //   event: React.MouseEvent<HTMLButtonElement>,
  //   tool: string
  // ) => {
  //   event.stopPropagation();
  //   setContentState((prev) => ({
  //     ...prev,
  //     tool,
  //   }));
  //   console.log("Ali");
  // };

  // const handleEraserBtn = (
  //   event: React.MouseEvent<HTMLButtonElement>,
  //   tool: string
  // ) => {
  //   event.stopPropagation();
  //   setContentState((prev) => ({ ...prev, tool }));
  // };

  const handleTextBtn = (event: React.MouseEvent<SVGElement>, tool: string) => {
    event.stopPropagation();
    setContentState((prev) => ({ ...prev, tool }));
  };

  // const handleSelectBtn = (
  //   event: React.MouseEvent<HTMLButtonElement>,
  //   tool: string
  // ) => {
  //   event.stopPropagation();
  //   setContentState((prev) => ({ ...prev, tool }));
  // };

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const image = await Image.fromURL(dataUrl);
        contentState.canvas?.add(image);
        contentState.canvas?.renderAll();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = event.target.value;
    const image = await Image.fromURL(url);
    contentState.canvas?.add(image);
    contentState.canvas?.renderAll();
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
        // activeObject.set({
        //   fill: isFillShape ? selectedColor : "transparent",
        //   stroke: selectedColor,
        //   strokeWidth,
        // });

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
        <label htmlFor="fileInput" className="text-base mb-2">
          <FaUpload className="mr-2 w-9 h-9" />
        </label>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm mb-4"
        />
        <label htmlFor="urlInput" className="text-base mb-2">
          <FaLink className="mr-2 w-9 h-9" />
        </label>
        <input
          type="text"
          id="urlInput"
          onChange={handleUrlChange}
          className="text-base mb-4 bg-white w-1/2 text-black"
          placeholder="image URL"
        />
      </div>
    </div>
  );
}

export default Menu;
