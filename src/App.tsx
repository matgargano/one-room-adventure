import TextAdventureParser from "./utilities/parser";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import getStatus from "./getStatus";
import { Actions } from "./const/actions";
import { addToInventory } from "./features/inventory/inventorySlice";
import { setWindow } from "./features/inventory/informationSlice";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string[]>([]);
  const [menuActive, setMenuActive] = useState<null | "inventory" | "location">(
    null
  );
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).focus();
    }
  }, []);

  const location = useSelector((state: RootState) => state.location);
  const inventory = useSelector((state: RootState) => state.inventory);
  const inventoryState = { items: inventory.items };
  const state = { location, inventory };

  const setMenuActiveDecorated = (menu: "inventory" | null) => {
    if (menu === menuActive) {
      return dispatch(setWindow(null));
    }
    dispatch(setWindow(menu));
  };

  const { name, description } = getStatus(state);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parser = new TextAdventureParser();
    const { message, action } = parser.parseCommand(input, state);
    setResponse([...response, message]);
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
    getStatus(state);
    setInput("");
  };

  return (
    <>
      <div className="sticky top-0 left-0 flex gap-5 relative">
        <strong
          onClick={() => setMenuActiveDecorated("inventory")}
          role="button"
          className={`button ${menuActive === "inventory" ? "underline" : ""}`}
        >
          Inventory
        </strong>
      </div>

      <div className="mt-10">
        <strong>Location</strong>: {name}
      </div>
      <div>
        {description.map((d) => (
          <p key={d}>{d}</p>
        ))}
        {response.map((r) => (
          <p key={r}>{r}</p>
        ))}
      </div>
      <div className="mt-auto">
        <form className="flex" onSubmit={handleSubmit}>
          <div className="w-full border-4 border-black flex">
            <div className="trs-cursor grow-0"></div>
            <input
              placeholder="What do you do?"
              ref={inputRef}
              type="text"
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent pl-2 pr-5 grow"
              value={input}
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
