import {
  BsAlignBottom,
  BsAlignCenter,
  BsAlignEnd,
  BsAlignMiddle,
  BsAlignStart,
  BsAlignTop,
} from "react-icons/bs";
import { LuMousePointerClick } from "react-icons/lu";
import { useContextCanvas } from "../hooks/useContextCanvas";
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
        <div className="flex items-center gap-2">
          <ColorField
            value={fillColor}
            onChange={(value) => handlePropertyChange("fill", value)}
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
        </div>
      </SettingCard>
    </div>
  );
}
export default ObjectSetting;
