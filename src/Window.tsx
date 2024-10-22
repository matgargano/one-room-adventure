import { useDispatch, useSelector } from "react-redux";
import { setWindow } from "./features/window/windowSlice";
import { RootState } from "./store";
import { INTRO, INVENTORY } from "./const/windows";
import type { ItemType } from "./const/items";
const Window = () => {
  const dispatch = useDispatch();
  const window = useSelector((state: RootState) => state.information.window);
  const color = useSelector((state: RootState) => state.information.color);
  const inventory = useSelector((state: RootState) =>
    Object.keys(state.inventory.items).filter(
      (item) => state.inventory.items[item as ItemType].location === INVENTORY
    )
  );
  const title = useSelector((state: RootState) => state.information.title);
  const close = () => {
    dispatch(setWindow(null));
  };

  if (!window) return <></>;

  let content = <></>;
  switch (window) {
    case INVENTORY:
      content = (
        <>
          {inventory.length === 0 ? (
            <div className="">No items in inventory</div>
          ) : (
            <ul className="ml-5 list-inside list-disc">
              {inventory.map((item: string) => (
                <li key={item} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </>
      );
      break;
    case INTRO:
      content = (
        <>
          <p>You have just awakened.</p>
          <p>
            You don't have the slightest idea where you are or even who you are!
          </p>
          <p>You seem to have amnesia from a blow to your head.</p>
          <button className="button mt-10 !text-white" onClick={close}>
            Get Started →
          </button>
        </>
      );
  }

  return (
    <div className="fixed inset-0 top-0 z-50 bg-black" onClick={close}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute left-1/2 top-1/2 z-10 h-[90%] lg:h-3/4 w-full py-10 lg:w-3/4 -translate-x-1/2 -translate-y-1/2 bg-${color} p-10 overflow-scroll`}
      >
        <button
          className="absolute right-[12px] top-[12px] text-2xl leading-none"
          onClick={close}
        >
          &times;
        </button>
        <h1 className="mb-10 text-2xl font-bold underline lg:text-4xl">
          {title}
        </h1>
        <>{content}</>
      </div>
    </div>
  );
};

export default Window;
