import { useDispatch, useSelector } from "react-redux";
import { setWindow } from "./features/inventory/informationSlice";
import { RootState } from "./store";

const Window = () => {
  const dispatch = useDispatch();
  const window = useSelector((state: RootState) => state.information.window);
  const inventory = useSelector((state: RootState) => state.inventory.items);
  const close = () => {
    dispatch(setWindow(null));
  };

  if (!window) return <></>;

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-red-500 z-[100000] p-10">
      <button
        className="absolute top-[12px] right-[12px] text-2xl leading-none"
        onClick={close}
      >
        &times;
      </button>
      <h1 className="text-2xl font-bold underline">Inventory</h1>
      {inventory.length === 0 ? (
        <div className="">No items in inventory</div>
      ) : (
        <ul className="list-disc list-inside ml-5">
          {inventory.map((item) => (
            <li key={item} className="list-disc">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Window;
