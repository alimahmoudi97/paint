import {
  BsAlignBottom,
  BsAlignCenter,
  BsAlignEnd,
  BsAlignMiddle,
  BsAlignStart,
  BsAlignTop,
} from "react-icons/bs";
import { TbLayoutDistributeHorizontal, TbLayoutDistributeVertical } from "react-icons/tb";
import { LuMousePointerClick } from "react-icons/lu";
import { Gradient } from "fabric";
import { useContextCanvas } from "../hooks/useContextCanvas";
import { useState } from "react";
import {
  ColorField,
  IconButton,
  NumberField,
  SettingCard,
  ToggleSwitch,
} from "./SettingControls";

function TransformStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
      <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-700 font-mono">
        {value.toFixed(0)}
      </div>
    </div>
  );
}

function ObjectSetting() {
  const { contentState, setContentState } = useContextCanvas();

  const alignObject = (alignment: string) => {
    const canvas = contentState.canvas;
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      switch (alignment) {
        case "vertical-start":
          activeObject.set({ top: 0 });
          break;
        case "vertical-middle":
          activeObject.set({
            top: canvas.height / 2 - activeObject.height / 2,
          });
          break;
        case "vertical-end":
          activeObject.set({ top: canvas.height - activeObject.height });
          break;
        case "horizontal-start":
          activeObject.set({ left: 0 });
          break;
        case "horizontal-middle":
          activeObject.set({ left: canvas.width / 2 - activeObject.width / 2 });
          break;
        case "horizontal-end":
          activeObject.set({ left: canvas.width - activeObject.width });
          break;
        default:
          break;
      }
      activeObject.setCoords();
      canvas.renderAll();
      setContentState((prev) => ({
        ...prev,
        selectedObject: activeObject,
      }));
    }
  };

  const handlePropertyChange = (
    property: string,
    value: string | number | boolean
  ) => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      activeObject.set(property, value);
      activeObject.setCoords();
      canvas.renderAll();
      if (property === "fill") {
        setContentState((prev) => ({
          ...prev,
          selectedObject: activeObject,
          colorShape: value as string,
        }));
      } else {
        setContentState((prev) => ({
          ...prev,
          selectedObject: activeObject,
        }));
      }
    }
  };

  const [fillMode, setFillMode] = useState<"solid" | "gradient">("solid");
  const [gradColor1, setGradColor1] = useState("#ff0000");
  const [gradColor2, setGradColor2] = useState("#0000ff");
  const [gradAngle, setGradAngle] = useState(0);

  const applyGradient = (c1: string, c2: string, angle: number) => {
    const canvas = contentState.canvas;
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;

    const rad = (angle * Math.PI) / 180;
    const gradient = new Gradient({
      type: "linear",
      gradientUnits: "percentage",
      coords: {
        x1: 0.5 - Math.cos(rad) * 0.5,
        y1: 0.5 - Math.sin(rad) * 0.5,
        x2: 0.5 + Math.cos(rad) * 0.5,
        y2: 0.5 + Math.sin(rad) * 0.5,
      },
      colorStops: [
        { offset: 0, color: c1 },
        { offset: 1, color: c2 },
      ],
    });
    obj.set("fill", gradient);
    canvas.renderAll();
    setContentState((prev) => ({ ...prev, selectedObject: obj }));
  };

  const distributeHorizontally = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || !(active as any).getObjects) return;
    const objects = [...(active as any).getObjects()].sort(
      (a: any, b: any) => a.left - b.left
    );
    if (objects.length < 3) return;
    const minLeft = objects[0].left;
    const maxLeft = objects[objects.length - 1].left;
    const spacing = (maxLeft - minLeft) / (objects.length - 1);
    objects.forEach((obj: any, i: number) => {
      obj.set({ left: minLeft + spacing * i });
      obj.setCoords();
    });
    canvas.renderAll();
  };

  const distributeVertically = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || !(active as any).getObjects) return;
    const objects = [...(active as any).getObjects()].sort(
      (a: any, b: any) => a.top - b.top
    );
    if (objects.length < 3) return;
    const minTop = objects[0].top;
    const maxTop = objects[objects.length - 1].top;
    const spacing = (maxTop - minTop) / (objects.length - 1);
    objects.forEach((obj: any, i: number) => {
      obj.set({ top: minTop + spacing * i });
      obj.setCoords();
    });
    canvas.renderAll();
  };

  const selectedObject = contentState.selectedObject;

  if (!selectedObject) {
    return (
      <SettingCard>
        <div className="flex flex-col items-center justify-center text-center py-6 text-gray-400">
          <LuMousePointerClick className="w-6 h-6 mb-2" />
          <p className="text-sm">Select an object on the canvas to edit its properties</p>
        </div>
      </SettingCard>
    );
  }

  const fillColor =
    typeof selectedObject.fill === "string" ? selectedObject.fill : "#000000";
  const strokeColor =
    typeof selectedObject.stroke === "string"
      ? selectedObject.stroke
      : "#000000";
  const opacityPercent =
    typeof selectedObject.opacity === "number"
      ? Math.round(selectedObject.opacity * 100)
      : 100;

  return (
    <div className="flex flex-col gap-3">
      <SettingCard title="Transform">
        <div className="grid grid-cols-2 gap-2">
          <TransformStat label="X" value={selectedObject.left} />
          <TransformStat label="Y" value={selectedObject.top} />
          <TransformStat label="Width" value={selectedObject.width} />
          <TransformStat label="Height" value={selectedObject.height} />
        </div>
      </SettingCard>

      <SettingCard title="Opacity">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={opacityPercent}
            onChange={(e) =>
              handlePropertyChange("opacity", parseInt(e.target.value) / 100)
            }
            className="flex-1 h-1.5 accent-purple-500 cursor-pointer"
          />
          <NumberField
            className="w-16"
            min={0}
            max={100}
            suffix="%"
            value={opacityPercent}
            onChange={(value) =>
              handlePropertyChange("opacity", parseFloat(value) / 100)
            }
          />
        </div>
      </SettingCard>

      <SettingCard title="Fill">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Enable fill</span>
          <ToggleSwitch
            checked={!!contentState.fillShape}
            onChange={(checked) =>
              setContentState((prev) => ({ ...prev, fillShape: checked }))
            }
          />
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5 mb-3">
          <button
            className={`flex-1 text-xs font-medium py-1.5 rounded-md cursor-pointer transition-all ${
              fillMode === "solid"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-500"
            }`}
            onClick={() => {
              setFillMode("solid");
              handlePropertyChange("fill", gradColor1);
            }}
          >
            Solid
          </button>
          <button
            className={`flex-1 text-xs font-medium py-1.5 rounded-md cursor-pointer transition-all ${
              fillMode === "gradient"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-500"
            }`}
            onClick={() => {
              setFillMode("gradient");
              applyGradient(gradColor1, gradColor2, gradAngle);
            }}
          >
            Gradient
          </button>
        </div>
        {fillMode === "solid" ? (
          <ColorField
            value={fillColor}
            onChange={(value) => handlePropertyChange("fill", value)}
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 w-8">Start</span>
              <ColorField
                value={gradColor1}
                onChange={(v) => {
                  setGradColor1(v);
                  applyGradient(v, gradColor2, gradAngle);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 w-8">End</span>
              <ColorField
                value={gradColor2}
                onChange={(v) => {
                  setGradColor2(v);
                  applyGradient(gradColor1, v, gradAngle);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 w-8">Angle</span>
              <input
                type="range"
                min={0}
                max={360}
                value={gradAngle}
                onChange={(e) => {
                  const a = parseInt(e.target.value);
                  setGradAngle(a);
                  applyGradient(gradColor1, gradColor2, a);
                }}
                className="flex-1 h-1.5 accent-purple-500 cursor-pointer"
              />
              <span className="text-xs text-gray-500 w-8 text-right font-mono">
                {gradAngle}°
              </span>
            </div>
          </div>
        )}
      </SettingCard>

      <SettingCard title="Stroke">
        <div className="flex items-center gap-2">
          <ColorField
            value={strokeColor}
            onChange={(value) => handlePropertyChange("stroke", value)}
          />
          <NumberField
            className="w-16"
            min={0}
            suffix="px"
            value={selectedObject.strokeWidth || 1}
            onChange={(value) => handlePropertyChange("strokeWidth", value)}
          />
        </div>
      </SettingCard>

      <SettingCard title="Alignment">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Vertical</span>
            <div className="flex gap-1.5">
              <IconButton title="Top" onClick={() => alignObject("vertical-start")}>
                <BsAlignTop />
              </IconButton>
              <IconButton title="Middle" onClick={() => alignObject("vertical-middle")}>
                <BsAlignMiddle />
              </IconButton>
              <IconButton title="Bottom" onClick={() => alignObject("vertical-end")}>
                <BsAlignBottom />
              </IconButton>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Horizontal</span>
            <div className="flex gap-1.5">
              <IconButton title="Left" onClick={() => alignObject("horizontal-start")}>
                <BsAlignStart />
              </IconButton>
              <IconButton title="Center" onClick={() => alignObject("horizontal-middle")}>
                <BsAlignCenter />
              </IconButton>
              <IconButton title="Right" onClick={() => alignObject("horizontal-end")}>
                <BsAlignEnd />
              </IconButton>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Distribute</span>
            <div className="flex gap-1.5">
              <IconButton title="Distribute Horizontally" onClick={distributeHorizontally}>
                <TbLayoutDistributeHorizontal />
              </IconButton>
              <IconButton title="Distribute Vertically" onClick={distributeVertically}>
                <TbLayoutDistributeVertical />
              </IconButton>
            </div>
          </div>
        </div>
      </SettingCard>
    </div>
  );
}
export default ObjectSetting;
