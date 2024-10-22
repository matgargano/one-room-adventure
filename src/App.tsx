import TextAdventureParser from "./utilities/parser";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, store } from "./store";
import { setWindow } from "./features/window/windowSlice";
import { INVENTORY, WindowState } from "./const/windows";
import { addLog } from "./features/log/logSlice";
import getLastItemsAfterClear from "./utilities/getLastItemsAfterClear";
import LogItem from "./types/LogItem";

import enterWhite from "./assets/enter-white.svg";
import { add } from "./features/command/commandSlice.ts";
function App() {
  const scrollContainerRef = useRef(null);
  const { commands } = useSelector((state: RootState) => state.command);

  const [input, setInput] = useState("");
  const [menuActive] = useState<WindowState>(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const {
    flag: { blindfolded },
  } = store.getState();

  useEffect(() => {
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).focus();
    }
  }, []);
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentIndex = commands.findIndex((cmd) => cmd === input);
      let newIndex;
      if (e.key === "ArrowUp") {
        newIndex = currentIndex > 0 ? currentIndex - 1 : commands.length - 1;
      } else {
        newIndex = currentIndex < commands.length - 1 ? currentIndex + 1 : 0;
      }
      setInput(commands[newIndex] || "");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const location = useSelector((state: RootState) => state.location);

  const { items } = useSelector((state: RootState) => state.log);

  useEffect(() => {
    // Scroll to the bottom of the container
    const element = scrollContainerRef.current;
    if (element) {
      (element as HTMLElement).scrollTop = (
        element as HTMLElement
      ).scrollHeight;
    }
  }, [items]);

  const setMenuActiveDecorated = (menu: WindowState) => {
    if (menu === menuActive) {
      return dispatch(setWindow(null));
    }
    dispatch(setWindow(menu));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parser = new TextAdventureParser();
    const { message } = parser.parseCommand(input);

    dispatch(addLog({ input, message }));
    dispatch(add({ command: input }));
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

      <div
        ref={scrollContainerRef}
        className="mt-10 h-[calc(100%-280px)] overflow-y-auto"
      >
        {getLastItemsAfterClear(items).map((item: LogItem, index) => {
          const { input, message } = item;
          let realMessage: string[] = [];
          if (typeof message === "string") {
            realMessage = [message];
          } else {
            realMessage = message;
          }

          return (
            <div key={`${index}-${item}`}>
              {index > 0 && (
                <p className="font-bold">&rarr; What should I do? {input}</p>
              )}
              {realMessage.map((message, index) => (
                <p key={`${index}-${message}`}>{message}</p>
              ))}
            </div>
          );
        })}
      </div>
      <div className="mt-auto">
        <form className="flex" onSubmit={handleSubmit}>
          <div className="flex w-full border-4 border-black">
            <div className="trs-cursor grow-0"></div>
            <input
              placeholder="What should I do?"
              ref={inputRef}
              type="text"
              onChange={(e) => handleInputChange(e)}
              onKeyUp={(e) => handleKeyUp(e)}
              className="grow bg-transparent pl-2 pr-5"
              value={input}
              name="input"
            />
          </div>
          <button
            className="button inline-flex grow-0 items-center justify-center"
            type="submit"
          >
            <div className="hidden lg:inline">Submit</div>
            <div className="">
              <img
                src={enterWhite}
                alt="arrow"
                className="block max-h-[24px]"
              />
            </div>
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
