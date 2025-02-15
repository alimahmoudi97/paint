import { useContextCanvas } from "../hooks/useContextCanvas";
import { useEffect } from "react";
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

function Header() {
  const { contentState, setContentState } = useContextCanvas();
  const { startRecording, stopRecording, recording, videoURL } =
    useCanvasRecorder();

  let isUndoing = false;

  const saveState = () => {
    if (isUndoing) return; // Prevent saving state during undo
    const canvas = contentState.canvas;
    if (canvas) {
      const canvasState = JSON.stringify(canvas.toJSON());
      console.log("Saving state:", canvasState);
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

    console.log("Before undo:", { undoStack, redoStack });

    if (undoStack.length > 0) {
      const lastItem = undoStack.pop(); // Remove the last state from the undo stack
      if (lastItem) {
        redoStack.push(lastItem); // Add it to the redo stack
      }

      const penultimateItem = undoStack[undoStack.length - 1];

      canvas.clear(); // Clear the canvas

      if (penultimateItem) {
        isUndoing = true; // Set the flag to prevent saving states
        canvas.loadFromJSON(penultimateItem, () => {
          canvas.discardActiveObject();
          canvas.renderAll(); // Render with the loaded state
          isUndoing = false; // Reset the flag after loading
        });
      } else {
        // If no penultimate state exists, clear the canvas
        canvas.renderAll();
      }

      // Update the content state
      setContentState((prev) => ({
        ...prev,
        undoStack,
        redoStack,
      }));

      console.log("After undo:", { undoStack, redoStack });
    } else {
      console.log("No states to undo.");
    }
  };
  const redo = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    const undoStack = [...contentState.undoStack];
    const redoStack = [...contentState.redoStack];

    console.log("Before redo:", { undoStack, redoStack });

    if (redoStack.length > 0) {
      const lastRedoItem = redoStack.pop(); // Remove the last state from the redo stack
      if (lastRedoItem) {
        undoStack.push(lastRedoItem); // Add it back to the undo stack
      }

      canvas.clear(); // Clear the canvas

      // Load the state from the last redo item
      if (lastRedoItem) {
        canvas.loadFromJSON(lastRedoItem, () => {
          canvas.discardActiveObject();
          canvas.renderAll(); // Render with the loaded state
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

      console.log("After redo:", { undoStack, redoStack });
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
    <div className="bg-gray-800 flex justify-between px-4 py-2">
      <div className="flex items-center gap-4 mt-6">
        <button
          className="text-base py-2 px-1 rounded cursor-pointer text-white"
          onClick={undo}
        >
          <FaUndo className="w-6 h-6" />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer text-white"
          onClick={redo}
        >
          <FaRedo className="w-6 h-6" />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer text-white"
          onClick={handleZoomIn}
        >
          <FaSearchPlus className="w-6 h-6" />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer text-white"
          onClick={handleZoomOut}
        >
          <FaSearchMinus className="w-6 h-6" />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer text-white"
          onClick={handleFit}
        >
          <FaExpand className="w-6 h-6" />
        </button>
        <button
          className="text-base py-2 px-1 rounded cursor-pointer text-white"
          onClick={handleResetZoom}
        >
          <FaUndo className="w-6 h-6" />
        </button>
      </div>
      <div className="flex flex-row gap-4">
        <button
          className="text-base py-2 px-1 mt-6 rounded cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
          onClick={handleExport}
        >
          Export as Image
        </button>
        <div className="flex items-center gap-4 mt-6">
          {recording ? (
            <button
              className="text-base py-2 px-1 rounded cursor-pointer bg-red-500 hover:bg-red-700 text-white"
              onClick={stopRecording}
            >
              <FaStop className="w-6 h-6" />
            </button>
          ) : (
            <button
              className="text-base py-2 px-1 rounded cursor-pointer bg-green-500 hover:bg-green-700 text-white"
              onClick={startRecording}
            >
              <FaVideo className="w-6 h-6" />
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
    </div>
  );
}
export default Header;
