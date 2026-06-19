import { useContextCanvas } from "../hooks/useContextCanvas";
import { useEffect, useRef } from "react";
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
import { TbZoomReset } from "react-icons/tb";
import { LuMousePointer } from "react-icons/lu";

function Header() {
  const { contentState, setContentState } = useContextCanvas();
  const { startRecording, stopRecording, recording, videoURL } =
    useCanvasRecorder();

  const isUndoingRef = useRef(false);

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
        <button
          title="Export as Image"
          className="flex items-center gap-2 text-sm font-semibold text-white pl-3.5 pr-4 py-2 rounded-full cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-md shadow-purple-500/30 transition-all duration-200"
          onClick={handleExport}
        >
          <FaDownload className="w-4 h-4" />
          Export
        </button>

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
