import { ActiveSelection, Canvas, Circle, FabricObject, Group, Line, Point } from "fabric";
import { useEffect, useRef, useState } from "react";
import { Shape } from "./Shapes";
import PenTool from "./PenTool";
import { TextTool } from "./TextTool";
import { useContextCanvas } from "../hooks/useContextCanvas";
import Toolbar from "./Toolbar";

const CELL_SIZE = 30;
const RULER_SIZE = 24;

function drawRulers(
  fabricCanvas: Canvas,
  hCanvas: HTMLCanvasElement | null,
  vCanvas: HTMLCanvasElement | null
) {
  if (!hCanvas || !vCanvas) return;

  const zoom = fabricCanvas.getZoom();
  const vpt = fabricCanvas.viewportTransform;
  const offsetX = vpt[4];
  const offsetY = vpt[5];
  const width = fabricCanvas.width;
  const height = fabricCanvas.height;

  const rawStep = 100 / zoom;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = norm <= 2 ? 2 * mag : norm <= 5 ? 5 * mag : 10 * mag;

  // Horizontal
  hCanvas.width = width;
  hCanvas.height = RULER_SIZE;
  const hCtx = hCanvas.getContext("2d")!;
  hCtx.fillStyle = "rgba(249,250,251,0.92)";
  hCtx.fillRect(0, 0, width, RULER_SIZE);
  hCtx.strokeStyle = "#9ca3af";
  hCtx.fillStyle = "#6b7280";
  hCtx.font = "9px sans-serif";
  hCtx.textAlign = "center";
  hCtx.lineWidth = 0.5;

  const startX = Math.floor(-offsetX / (zoom * step)) * step;
  for (let val = startX; val * zoom + offsetX <= width; val += step) {
    const x = val * zoom + offsetX;
    if (x < 0) continue;
    hCtx.beginPath();
    hCtx.moveTo(x, RULER_SIZE - 8);
    hCtx.lineTo(x, RULER_SIZE);
    hCtx.stroke();
    hCtx.fillText(String(Math.round(val)), x, RULER_SIZE - 10);
    const minor = step / 5;
    for (let m = 1; m < 5; m++) {
      const mx = (val + m * minor) * zoom + offsetX;
      if (mx < 0 || mx > width) continue;
      hCtx.beginPath();
      hCtx.moveTo(mx, RULER_SIZE - 4);
      hCtx.lineTo(mx, RULER_SIZE);
      hCtx.stroke();
    }
  }
  hCtx.strokeStyle = "#d1d5db";
  hCtx.lineWidth = 1;
  hCtx.beginPath();
  hCtx.moveTo(0, RULER_SIZE - 0.5);
  hCtx.lineTo(width, RULER_SIZE - 0.5);
  hCtx.stroke();

  // Vertical
  vCanvas.width = RULER_SIZE;
  vCanvas.height = height;
  const vCtx = vCanvas.getContext("2d")!;
  vCtx.fillStyle = "rgba(249,250,251,0.92)";
  vCtx.fillRect(0, 0, RULER_SIZE, height);
  vCtx.strokeStyle = "#9ca3af";
  vCtx.fillStyle = "#6b7280";
  vCtx.font = "9px sans-serif";
  vCtx.textAlign = "center";
  vCtx.lineWidth = 0.5;

  const startY = Math.floor(-offsetY / (zoom * step)) * step;
  for (let val = startY; val * zoom + offsetY <= height; val += step) {
    const y = val * zoom + offsetY;
    if (y < 0) continue;
    vCtx.beginPath();
    vCtx.moveTo(RULER_SIZE - 8, y);
    vCtx.lineTo(RULER_SIZE, y);
    vCtx.stroke();
    vCtx.save();
    vCtx.translate(RULER_SIZE - 10, y);
    vCtx.rotate(-Math.PI / 2);
    vCtx.fillText(String(Math.round(val)), 0, 0);
    vCtx.restore();
    const minor = step / 5;
    for (let m = 1; m < 5; m++) {
      const my = (val + m * minor) * zoom + offsetY;
      if (my < 0 || my > height) continue;
      vCtx.beginPath();
      vCtx.moveTo(RULER_SIZE - 4, my);
      vCtx.lineTo(RULER_SIZE, my);
      vCtx.stroke();
    }
  }
  vCtx.strokeStyle = "#d1d5db";
  vCtx.lineWidth = 1;
  vCtx.beginPath();
  vCtx.moveTo(RULER_SIZE - 0.5, 0);
  vCtx.lineTo(RULER_SIZE - 0.5, height);
  vCtx.stroke();
}

function CanvasWrapper() {
  const { contentState, setContentState } = useContextCanvas();
  const canvasRef = useRef(null);
  const fabricRef = useRef<Canvas | null>(null);
  const cursorCircleRef = useRef<Circle | null>(null);
  const horizontalGuideRef = useRef<Line | null>(null);
  const verticalGuideRef = useRef<Line | null>(null);
  const canvasBackgroundColorRef = useRef(contentState.canvasBackgroundColor);
  const showBackgroundGridRef=useRef(contentState.showBackgroundGrid);
  const clipboardRef = useRef<FabricObject | null>(null);
  const hRulerRef = useRef<HTMLCanvasElement | null>(null);
  const vRulerRef = useRef<HTMLCanvasElement | null>(null);
  const isPanModeRef = useRef(false);
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    // if (fabricRef.current) return;

    const canvas = new Canvas(canvasRef.current, { perPixelTargetFind: true });
    fabricRef.current = canvas;

    canvas.selectionDashArray = [10, 20];
    canvas.selectionLineWidth = 1;
    canvas.selectionColor = "transparent";
    canvas.selectionBorderColor = "blue";

    canvas._renderBackground = function (ctx) {

      
      ctx.fillStyle = canvasBackgroundColorRef.current;
      if(!showBackgroundGridRef.current) return
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const offsetX = this.viewportTransform[4];
      const offsetY = this.viewportTransform[5];

      ctx.strokeStyle = "#e6fbff";
      ctx.lineWidth = 1;

      const gridSize = CELL_SIZE;

      const numCellsX = Math.ceil(canvas.width / gridSize);
      const numCellsY = Math.ceil(canvas.height / gridSize);

      const gridOffsetX = offsetX % gridSize;
      const gridOffsetY = offsetY % gridSize;

      ctx.save();
      ctx.beginPath();

      for (let i = 0; i <= numCellsX; i++) {
        const x = gridOffsetX + i * gridSize;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }

      for (let i = 0; i <= numCellsY; i++) {
        const y = gridOffsetY + i * gridSize;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }

      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    };

    canvas.setWidth(Math.floor(window.document.body.offsetWidth * 0.8));
    canvas.setHeight(Math.floor(window.innerHeight * 0.9));

    setContentState((prev) => ({ ...prev, canvas: canvas }));

    const cursorCircle = new Circle({
      radius: 5,
      fill: "red",
      selectable: false,
      evented: false,
    });
    cursorCircleRef.current = cursorCircle;
    canvas.add(cursorCircle);

    // const handleMouseMove = (event) => {
    //   const pointer = canvas.getPointer(event.e);
    //   cursorCircle.set({ left: pointer.x, top: pointer.y });
    //   cursorCircle.setCoords();
    //   canvas.renderAll();
    // };

    // canvas.on("mouse:move", handleMouseMove);


    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isPanModeRef.current = true;
        canvas.defaultCursor = "grab";
        canvas.renderAll();
      }
      if (e.ctrlKey && e.code === "KeyH") {
        isPanModeRef.current = true;
        canvas.defaultCursor = "grab";
        canvas.renderAll();
      }

      if (e.code === "Delete" || e.code === "Backspace") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        const activeObject = canvas.getActiveObject();
        if (activeObject && !(activeObject as any).isEditing) {
          canvas.remove(activeObject);
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }

      if (e.ctrlKey && e.code === "KeyD") {
        e.preventDefault();
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          activeObject.clone().then((cloned: FabricObject) => {
            cloned.set({
              left: (activeObject.left || 0) + 10,
              top: (activeObject.top || 0) + 10,
              evented: true,
            });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.requestRenderAll();
          });
        }
      }

      if (e.ctrlKey && !e.shiftKey && e.code === "KeyG") {
        e.preventDefault();
        const activeObject = canvas.getActiveObject();
        if (activeObject instanceof ActiveSelection) {
          const objects = activeObject.getObjects();
          canvas.discardActiveObject();
          objects.forEach((obj) => canvas.remove(obj));
          const group = new Group(objects);
          canvas.add(group);
          canvas.setActiveObject(group);
          canvas.requestRenderAll();
        }
      }

      if (e.ctrlKey && e.shiftKey && e.code === "KeyG") {
        e.preventDefault();
        const activeObject = canvas.getActiveObject();
        if (activeObject instanceof Group && !(activeObject instanceof ActiveSelection)) {
          const objects = activeObject.removeAll();
          canvas.remove(activeObject);
          objects.forEach((obj) => canvas.add(obj));
          canvas.requestRenderAll();
        }
      }

      if (e.ctrlKey && e.code === "KeyC") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        const activeObject = canvas.getActiveObject();
        if (activeObject && !(activeObject as any).isEditing) {
          activeObject.clone().then((cloned: FabricObject) => {
            clipboardRef.current = cloned;
          });
        }
      }

      if (e.ctrlKey && e.code === "KeyX") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        const activeObject = canvas.getActiveObject();
        if (activeObject && !(activeObject as any).isEditing) {
          activeObject.clone().then((cloned: FabricObject) => {
            clipboardRef.current = cloned;
            canvas.remove(activeObject);
            canvas.discardActiveObject();
            canvas.requestRenderAll();
          });
        }
      }

      if (e.ctrlKey && e.code === "KeyV") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        if (clipboardRef.current) {
          clipboardRef.current.clone().then((cloned: FabricObject) => {
            cloned.set({
              left: (cloned.left || 0) + 20,
              top: (cloned.top || 0) + 20,
              evented: true,
            });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.requestRenderAll();
            clipboardRef.current!.set({
              left: (clipboardRef.current!.left || 0) + 20,
              top: (clipboardRef.current!.top || 0) + 20,
            });
          });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isPanModeRef.current = false;
        isDraggingRef.current = false;
        canvas.defaultCursor = "default";
        canvas.renderAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    canvas.on("mouse:down", (opt) => {
      if (isPanModeRef.current) {
        const e = opt.e as MouseEvent;
        isDraggingRef.current = true;
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        canvas.defaultCursor = "grabbing";
      }
    });

    canvas.on("mouse:move", (opt) => {
      if (!isDraggingRef.current) return;
      const e = opt.e as MouseEvent;
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      canvas.relativePan(new Point(dx, dy));
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    });

    canvas.on("mouse:up", () => {
      isDraggingRef.current = false;
      if (isPanModeRef.current) {
        canvas.defaultCursor = "grab";
      }
    });

    canvas.on("object:moving", (e) => {
      if (!showBackgroundGridRef.current) return;
      const obj = e.target;
      if (obj) {
        obj.set({
          left: Math.round((obj.left || 0) / CELL_SIZE) * CELL_SIZE,
          top: Math.round((obj.top || 0) / CELL_SIZE) * CELL_SIZE,
        });
      }
    });

    canvas.on("after:render", () => {
      drawRulers(canvas, hRulerRef.current, vRulerRef.current);
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    canvasBackgroundColorRef.current = contentState.canvasBackgroundColor;
    fabricRef.current?.renderAll();
  }, [contentState.canvasBackgroundColor]);

  useEffect(()=>{
    console.log("showBG:",contentState.showBackgroundGrid)
    showBackgroundGridRef.current=contentState.showBackgroundGrid
    fabricRef.current?.renderAll();
  },[contentState.showBackgroundGrid])

  useEffect(() => {
    if (!fabricRef.current) return;
    const shapeEventListener = Shape({
      canvas: fabricRef.current,
      contentState,
      setContentState,
    });

    // const eraserEventListener = EraserTool({
    //   canvas: fabricRef.current,
    //   contentState,
    //   setContentState,
    // });

    const textEventListener = TextTool({
      canvas: fabricRef.current,
      contentState,
      setContentState,
    });

    const penEventListener = PenTool({
      canvas: fabricRef.current,
      contentState,
      setContentState,
    });

    return () => {
      shapeEventListener.removeEventListener();
      // eraserEventListener.removeEventListener();
      textEventListener.textEventListener();
      penEventListener.removeEventListeners();
    };
  }, [contentState]);

  // useEffect(() => {
  //   if (fabricRef.current && contentState.tool == "pen") {
  //     PenTool({ canvas: fabricRef.current, contentState, setContentState });
  //     console.log(contentState.tool);
  //   }
  // }, [contentState.tool]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (contentState.canvas && contentState.tool !== "pen") {
      contentState.canvas.isDrawingMode = false;
    }

    // console.log(contentState.tool);
  }, [contentState]);

  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set({
        fill: contentState.fillShape ? contentState.colorShape : "transparent",
        stroke: contentState.strokeColor,
      });
      canvas.renderAll();
    }
  }, [
    contentState.colorShape,
    contentState.strokeColor,
    contentState.fillShape,
  ]);

  useEffect(() => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;

    const handleObjectSelected = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        setContentState((prev) => ({
          ...prev,
          selectedObject: activeObject,
        }));
        setToolbarPosition({
          top: activeObject.top,
          left: activeObject.left,
          width: activeObject.width,
          height: activeObject.height,
        });
      } else {
        setToolbarPosition(null);
      }
    };

    interface HandleObjectMovingEvent {
      target: FabricObject;
    }

    const handleObjectMoving = (e: HandleObjectMovingEvent) => {
      const activeObject = e.target;
      if (activeObject) {
        const canvasWidth = canvas.width!;
        const canvasHeight = canvas.height!;
        const centerX = activeObject.left! + activeObject.width! / 2;
        const centerY = activeObject.top! + activeObject.height! / 2;

        if (!horizontalGuideRef.current) {
          horizontalGuideRef.current = new Line(
            [0, centerY, canvasWidth, centerY],
            {
              stroke: "red",
              strokeWidth: 1,
              strokeDashArray: [10, 5, 2, 5],
              selectable: false,
              evented: false,
            }
          );
          canvas.add(horizontalGuideRef.current);
        } else {
          horizontalGuideRef.current.set({
            y1: centerY,
            y2: centerY,
          });
        }

        if (!verticalGuideRef.current) {
          verticalGuideRef.current = new Line(
            [centerX, 0, centerX, canvasHeight],
            {
              stroke: "red",
              strokeWidth: 1,
              strokeDashArray: [10, 5, 2, 5],
              selectable: false,
              evented: false,
            }
          );
          canvas.add(verticalGuideRef.current);
        } else {
          verticalGuideRef.current.set({
            x1: centerX,
            x2: centerX,
          });
        }
        setContentState((prev) => ({
          ...prev,
          selectedObject: activeObject,
        }));

        setToolbarPosition({
          top: activeObject.top!,
          left: activeObject.left!,
          width: activeObject.width!,
          height: activeObject.height!,
        });

        canvas.renderAll();
      }
    };

    const handleObjectModified = () => {
      if (horizontalGuideRef.current) {
        canvas.remove(horizontalGuideRef.current);
        horizontalGuideRef.current = null;
      }
      if (verticalGuideRef.current) {
        canvas.remove(verticalGuideRef.current);
        verticalGuideRef.current = null;
      }
      canvas.renderAll();
    };

    canvas.on("selection:cleared", handleObjectSelected);
    canvas.on("selection:updated", handleObjectSelected);
    canvas.on("object:moving", handleObjectMoving);
    canvas.on("object:modified", handleObjectModified);

    return () => {
      canvas.off("selection:cleared", handleObjectSelected);
      canvas.off("selection:updated", handleObjectSelected);
      canvas.off("object:moving", handleObjectMoving);
      canvas.off("object:modified", handleObjectModified);
    };
  }, [contentState]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} id="canvas" className="border border-amber-300" />
      <div className="absolute top-0 left-0 w-6 h-6 bg-gray-50/95 border-r border-b border-gray-300 z-20 pointer-events-none" />
      <canvas
        ref={hRulerRef}
        className="absolute top-0 left-6 z-10 pointer-events-none"
        height={RULER_SIZE}
      />
      <canvas
        ref={vRulerRef}
        className="absolute top-6 left-0 z-10 pointer-events-none"
        width={RULER_SIZE}
      />
      {toolbarPosition && (
        <Toolbar
          top={toolbarPosition.top}
          left={toolbarPosition.left}
          width={toolbarPosition.width}
          height={toolbarPosition.height}
        />
      )}
    </div>
  );
}
export default CanvasWrapper;
