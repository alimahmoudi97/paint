import { useContextCanvas } from "../hooks/useContextCanvas";
import { useEffect, useRef } from "react";
import {
  FaExpand,
  FaRedo,
  FaSearchMinus,
  FaSearchPlus,
  FaStop,
  FaUndo,
  FaVideo,
} from "react-icons/fa";
import useCanvasRecorder from "../hooks/useCanvasRecorder";
import { IoIosRedo, IoIosUndo } from "react-icons/io";
import { TbZoomReset } from "react-icons/tb";

function Header() {
  const { contentState, setContentState } = useContextCanvas();
  const { startRecording, stopRecording, recording, videoURL } =
    useCanvasRecorder();

  const isUndoingRef = useRef(false);

  const saveState = () => {
    if (isUndoingRef.current) return; // Prevent saving state during undo
    const canvas = contentState.canvas;
    if (canvas) {
      const canvasState = JSON.stringify(canvas.toJSON());
      setContentState((prev) => ({
        ...prev,
        undoStack: [...prev.undoStack, canvasState],
        redoStack: [], // Clear redo stack on new action
      }));
    }
  };

  const undo = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    const undoStack = [...contentState.undoStack];
    const redoStack = [...contentState.redoStack];

    if (undoStack.length > 0) {
      const lastItem = undoStack.pop(); // Remove the last state from the undo stack
      if (lastItem) {
        redoStack.push(lastItem); // Add it to the redo stack
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

      // Update the content state
      setContentState((prev) => ({
        ...prev,
        undoStack,
        redoStack,
      }));
    } else {
      console.log("No states to undo.");
    }
  };

  const redo = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    const undoStack = [...contentState.undoStack];
    const redoStack = [...contentState.redoStack];

    if (redoStack.length > 0) {
      const lastRedoItem = redoStack.pop(); // Remove the last state from the redo stack
      if (lastRedoItem) {
        undoStack.push(lastRedoItem); // Add it back to the undo stack
      }

      canvas.clear();

      // Load the state from the last redo item
      if (lastRedoItem) {
        isUndoingRef.current = true;
        canvas.loadFromJSON(lastRedoItem).then((canvas) => {
          canvas.discardActiveObject();
          canvas.renderAll(); // Render with the loaded state
          isUndoingRef.current = false;
        });
      } else {
        // If no state exists in the redo stack, just render an empty canvas
        canvas.renderAll();
      }

      // Update the content state
      setContentState((prev) => ({
        ...prev,
        undoStack,
        redoStack,
      }));
    } else {
      console.log("No states to redo.");
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

  useEffect(() => {
    const canvas = contentState.canvas;
    if (canvas) {
      canvas.on("object:added", saveState);
      canvas.on("object:modified", saveState);
      canvas.on("object:removed", saveState);
    }

    return () => {
      if (canvas) {
        canvas.off("object:added", saveState);
        canvas.off("object:modified", saveState);
        canvas.off("object:removed", saveState);
      }
    };
  }, [contentState.canvas]);

  return (
    <div className="flex justify-between px-4 py-2 shadow">
      <div className="flex items-center gap-4">
        <button
          className="text-base py-2 px-1 rounded cursor-pointer "
          onClick={undo}
        >
          <IoIosUndo className="w-6 h-6 text-gray-500" />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer "
          onClick={redo}
        >
          <IoIosRedo className="w-6 h-6 text-gray-500" />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer "
          onClick={handleZoomIn}
        >
          <FaSearchPlus className="w-6 h-6 text-gray-500" />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer "
          onClick={handleZoomOut}
        >
          <FaSearchMinus className="w-6 h-6 text-gray-500" />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer "
          onClick={handleFit}
        >
          <FaExpand className="w-6 h-6 text-gray-500" />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer "
          onClick={handleResetZoom}
        >
          <TbZoomReset className="w-6 h-6 text-gray-500" />
        </button>
      </div>
      <div className="flex flex-row gap-4">
        <button
          className="text-base text-white py-2 px-2 rounded cursor-pointer bg-gray-500 hover:bg-blue-700 "
          onClick={handleExport}
        >
          Export as Image
        </button>
        <div className="flex items-center gap-4">
          {recording ? (
            <button
              className="text-base py-2 px-1 rounded cursor-pointer bg-red-500 hover:bg-red-700 "
              onClick={stopRecording}
            >
              <FaStop className="w-6 h-6" />
            </button>
          ) : (
            <button
              className="text-base py-2 px-2 rounded-full text-white cursor-pointer bg-green-500 hover:bg-green-700 "
              onClick={startRecording}
            >
              <FaVideo className="w-6 h-6" />
            </button>
          )}
          {videoURL && (
            <a
              href={videoURL}
              download="canvas-recording.webm"
              className="text-base py-2 px-1 rounded cursor-pointer bg-blue-500 hover:bg-blue-700 "
            >
              Download Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
export default Header;
