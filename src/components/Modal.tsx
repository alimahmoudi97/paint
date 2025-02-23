import { FabricImage } from "fabric";
import { FaLink, FaUpload } from "react-icons/fa";
import { useContextCanvas } from "../hooks/useContextCanvas";

function Modal() {
  const { contentState, setContentState } = useContextCanvas();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const image = await FabricImage.fromURL(dataUrl);
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
    const image = await FabricImage.fromURL(url);
    contentState.canvas?.add(image);
    contentState.canvas?.renderAll();
  };
  return (
    contentState.showModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() =>
            setContentState((prev) => ({ ...prev, showModal: false }))
          }
        ></div>
        <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-96">
          <div className="border-b text-black ">Import Image</div>
          <label htmlFor="fileInput" className="text-xs">
            <FaUpload className="mr-2 w-6 h-6" />
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            className="text-xs mb-4"
          />
          <label htmlFor="urlInput" className="text-base mb-2">
            <FaLink className="mr-2 w-6 h-6" />
          </label>
          <input
            type="text"
            id="urlInput"
            onChange={handleUrlChange}
            className="text-sx mb-4 bg-white w-1/2 text-black"
            placeholder="image URL"
          />
          <button
            className="bg-red-600 w-full py-2 rounded cursor-pointer text-white"
            onClick={() =>
              setContentState((prev) => ({ ...prev, showModal: false }))
            }
          >
            Close
          </button>
        </div>
      </div>
    )
  );
}

export default Modal;
