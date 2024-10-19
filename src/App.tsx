import TextAdventureParser from "./utilities/parser";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, store } from "./store";
import { Actions } from "./const/actions";
import { addToInventory } from "./features/inventory/inventorySlice";
import { setWindow } from "./features/window/windowSlice";
import { INVENTORY, WindowState } from "./const/windows";
import { addLog } from "./features/log/logSlice";

function App() {
  const [input, setInput] = useState("");
  const [menuActive, setMenuActive] = useState<WindowState>(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const {
    flag: { blindfolded, handsTied },
  } = store.getState();

  useEffect(() => {
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).focus();
    }
  }, []);

  const location = useSelector((state: RootState) => state.location);
  const { window } = useSelector((state: RootState) => state.information);
  const { items } = useSelector((state: RootState) => state.log);

  const setMenuActiveDecorated = (menu: WindowState) => {
    if (menu === menuActive) {
      return dispatch(setWindow(null));
    }
    dispatch(setWindow(menu));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parser = new TextAdventureParser();
    const { message, action } = parser.parseCommand(input);
    dispatch(addLog(message));
    if (action) {
      const { verb, item } = action;
      if (!item || typeof item !== "string") {
        return;
      }
      switch (verb) {
        case Actions.TAKE:
          dispatch(addToInventory({ item }));
          break;
      }
    }
    setInput("");
  };

  return (
    <>
      <div className="relative sticky left-0 top-0 flex gap-5 bg-main">
        <strong
          onClick={() => setMenuActiveDecorated(INVENTORY)}
          role="button"
          className={`button ${menuActive === INVENTORY ? "underline" : ""}`}
        >
          Inventory
        </strong>
        <strong className="capitalize">
          Facing{" "}
          {!blindfolded ? (
            <u className="animate__animated animate__heartBeat">
              {location.direction}
            </u>
          ) : (
            <u>????</u>
          )}
        </strong>
      </div>

      <div className="mt-10 max-h-[calc(100%-10px)] overflow-y-auto">
        <p>OK</p>
        {items.map((i, index) => (
          <p key={`${index}-${i}`}>{i}</p>
        ))}
      </div>
      <div className="mt-auto">
        <form className="flex" onSubmit={handleSubmit}>
          <div className="flex w-full border-4 border-black">
            <div className="trs-cursor grow-0"></div>
            <input
              placeholder="What do you do?"
              ref={inputRef}
              type="text"
              onChange={(e) => setInput(e.target.value)}
              className="grow bg-transparent pl-2 pr-5"
              value={input}
              name="input"
            />
          </div>
          <button className="button grow-0" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
