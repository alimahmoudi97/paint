import { useContextCanvas } from "../hooks/useContextCanvas";
import { useEffect, useRef, useState } from "react";
import {
  FaDownload,
  FaExpand,
  FaSearchMinus,
  FaSearchPlus,
  FaStop,
  FaVideo,
  FaSave,
} from "react-icons/fa";
import useCanvasRecorder from "../hooks/useCanvasRecorder";
import { IoIosRedo, IoIosUndo } from "react-icons/io";
import { TbZoomReset, TbGrid3X3 } from "react-icons/tb";
import { LuMousePointer } from "react-icons/lu";

function Header() {
  const { contentState, setContentState } = useContextCanvas();
  const { startRecording, stopRecording, recording, videoURL } =
    useCanvasRecorder();

  const isUndoingRef = useRef(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const saveState = () => {
    if (isUndoingRef.current) return;
    const canvas = contentState.canvas;
    if (canvas) {
      const canvasState = JSON.stringify(canvas.toJSON());
      setContentState((prev) => ({
        ...prev,
        undoStack: [...prev.undoStack, canvasState],
        redoStack: [],
      }));
    }
  };

  const undo = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    const undoStack = [...contentState.undoStack];
    const redoStack = [...contentState.redoStack];

    if (undoStack.length > 0) {
      const lastItem = undoStack.pop();
      if (lastItem) {
        redoStack.push(lastItem);
      }

      const penultimateItem = undoStack[undoStack.length - 1];

      canvas.clear();

      if (penultimateItem) {
        isUndoingRef.current = true;
        canvas.loadFromJSON(penultimateItem).then((canvas) => {
          canvas.discardActiveObject();
          canvas.renderAll();
          isUndoingRef.current = false;
        });
      } else {
        canvas.renderAll();
      }

      setContentState((prev) => ({
        ...prev,
        undoStack,
        redoStack,
      }));
    } else {
      // console.log("No states to undo.");
    }
  };

  const redo = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    const undoStack = [...contentState.undoStack];
    const redoStack = [...contentState.redoStack];

    if (redoStack.length > 0) {
      const lastRedoItem = redoStack.pop();
      if (lastRedoItem) {
        undoStack.push(lastRedoItem);
      }

      canvas.clear();

      if (lastRedoItem) {
        isUndoingRef.current = true;
        canvas.loadFromJSON(lastRedoItem).then((canvas) => {
          canvas.discardActiveObject();
          canvas.renderAll();
          isUndoingRef.current = false;
        });
      } else {
        canvas.renderAll();
      }

      setContentState((prev) => ({
        ...prev,
        undoStack,
        redoStack,
      }));
    } else {
      // console.log("No states to redo.");
    }
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

  const handleExport = (format: "png" | "jpeg" | "svg") => {
    if (!contentState.canvas) return;

    if (format === "svg") {
      const svg = contentState.canvas.toSVG();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "canvas.svg";
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const dataURL = contentState.canvas.toDataURL({
        format,
        quality: 1.0,
        multiplier: 1,
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `canvas.${format === "jpeg" ? "jpg" : format}`;
      link.click();
    }
    setShowExportMenu(false);
  };

  const handleShowBackgroundGrid=()=>{
    setContentState((p)=>({
      ...p,
      showBackgroundGrid:!p.showBackgroundGrid
    }));
  }

  const handleSave = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;
    localStorage.setItem("canvas", JSON.stringify(canvas.toJSON()));
  };

  const handleLoad = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;
    const saved = localStorage.getItem("canvas");
    if (!saved) return;
    canvas.clear();
    canvas.loadFromJSON(JSON.parse(saved)).then(() => canvas.renderAll());
  };

  const undoFnRef = useRef(undo);
  const redoFnRef = useRef(redo);
  const saveFnRef = useRef(handleSave);
  undoFnRef.current = undo;
  redoFnRef.current = redo;
  saveFnRef.current = handleSave;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === "KeyZ" && !e.shiftKey) {
        e.preventDefault();
        undoFnRef.current();
      }
      if (e.ctrlKey && e.code === "KeyY") {
        e.preventDefault();
        redoFnRef.current();
      }
      if (e.ctrlKey && e.shiftKey && e.code === "KeyZ") {
        e.preventDefault();
        redoFnRef.current();
      }
      if (e.ctrlKey && e.code === "KeyS") {
        e.preventDefault();
        saveFnRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = contentState.canvas;
    if (canvas) {
      canvas.on("object:added", saveState);
      canvas.on("object:modified", saveState);
      canvas.on("object:removed", saveState);
      handleLoad();
    }

    return () => {
      if (canvas) {
        canvas.off("object:added", saveState);
        canvas.off("object:modified", saveState);
        canvas.off("object:removed", saveState);
      }
    };
  }, [contentState.canvas]);

  const iconBtnBase =
    "flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-200";
  const iconBtnInactive = "text-gray-500 hover:bg-gray-100 hover:text-purple-500";
  const iconBtnActive =
    "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30";

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100 shadow-sm relative z-10">
      <div className="flex items-center gap-1">
        <button title="Undo" className={`${iconBtnBase} ${iconBtnInactive}`} onClick={undo}>
          <IoIosUndo className="w-5 h-5" />
        </button>
        <button title="Redo" className={`${iconBtnBase} ${iconBtnInactive}`} onClick={redo}>
          <IoIosRedo className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <button title="Zoom In" className={`${iconBtnBase} ${iconBtnInactive}`} onClick={handleZoomIn}>
          <FaSearchPlus className="w-4 h-4" />
        </button>
        <button title="Zoom Out" className={`${iconBtnBase} ${iconBtnInactive}`} onClick={handleZoomOut}>
          <FaSearchMinus className="w-4 h-4" />
        </button>
        <button title="Fit to Screen" className={`${iconBtnBase} ${iconBtnInactive}`} onClick={handleFit}>
          <FaExpand className="w-4 h-4" />
        </button>
        <button title="Reset Zoom" className={`${iconBtnBase} ${iconBtnInactive}`} onClick={handleResetZoom}>
          <TbZoomReset className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <button
          title="Select"
          className={`${iconBtnBase} ${
            contentState.tool === "select" ? iconBtnActive : iconBtnInactive
          }`}
          onClick={() => {
            setContentState((prev) => ({ ...prev, tool: "select" }));
          }}
        >
          <LuMousePointer className="w-5 h-5" />
        </button>
        <button
          title="Toggle Grid"
          className={`${iconBtnBase} transition-opacity duration-200 ${
            contentState.showBackgroundGrid
              ? iconBtnInactive
              : "text-gray-300 hover:bg-gray-100"
          }`}
          onClick={handleShowBackgroundGrid}
        >
          <TbGrid3X3 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          title="Save"
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 pl-3.5 pr-4 py-2 rounded-full cursor-pointer border border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
          onClick={handleSave}
        >
          <FaSave className="w-4 h-4" />
          Save
        </button>
        <div className="relative">
          <button
            title="Export as Image"
            className="flex items-center gap-2 text-sm font-semibold text-white pl-3.5 pr-4 py-2 rounded-full cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-md shadow-purple-500/30 transition-all duration-200"
            onClick={() => setShowExportMenu(!showExportMenu)}
          >
            <FaDownload className="w-4 h-4" />
            Export
          </button>
          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[140px] z-50">
                {(["png", "jpeg", "svg"] as const).map((format) => (
                  <button
                    key={format}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                    onClick={() => handleExport(format)}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {recording ? (
          <button
            title="Stop Recording"
            className="flex items-center gap-2 text-sm font-semibold text-white pl-3.5 pr-4 py-2 rounded-full cursor-pointer bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/30 transition-all duration-200"
            onClick={stopRecording}
          >
            <FaStop className="w-4 h-4" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          </button>
        ) : (
          <button
            title="Start Recording"
            className={`${iconBtnBase} ${iconBtnInactive} hover:bg-red-50 hover:text-red-500`}
            onClick={startRecording}
          >
            <FaVideo className="w-5 h-5" />
          </button>
        )}

        {videoURL && (
          <a
            href={videoURL}
            download="canvas-recording.webm"
            title="Download Recording"
            className="flex items-center gap-2 text-sm font-semibold text-white pl-3.5 pr-4 py-2 rounded-full cursor-pointer bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/30 transition-all duration-200"
          >
            <FaDownload className="w-4 h-4" />
            Video
          </a>
        )}
      </div>
    </div>
  );
}
export default Header;
