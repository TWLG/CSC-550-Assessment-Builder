"use client";
import {useRouter} from "next/navigation";
import {useCallback} from "react";

interface ModalProps {
  pin: string;
  onClose: () => void;
}

export default function Modal({pin, onClose}: ModalProps) {
  const router = useRouter();
  // Use useCallback to memoize the handlera
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).id === "modal-overlay") {
        onClose();
      }
    },
    [onClose]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (document.getElementById("keypadInput") as HTMLInputElement)
      .value;
    if (input === pin) {
      router.push("/dashboard");
      onClose();
    }
    if (input) {
      (document.getElementById("keypadInput") as HTMLInputElement).value = ""; // Reset the input field
    }
  };

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const buttonValue = e.currentTarget.value;
    const input = document.getElementById("keypadInput") as HTMLInputElement;
    if (input) {
      input.value += buttonValue;
    }
  }

  function clearInput(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    (document.getElementById("keypadInput") as HTMLInputElement).value = "";
  }

  return (
    <>
      <div
        id="modal-overlay"
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="bg-[var(--background-color)] p-6 rounded-lg shadow-lg max-w-sm mx-auto text-[var(--text-color)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              id="keypadInput"
              type="number"
              className="w-full p-2 border border-[var(--primary-color)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] no-increment"
            />
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                value="7"
                onClick={handleButtonClick}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300"
              >
                7
              </button>
              <button
                value="8"
                onClick={handleButtonClick}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300"
              >
                8
              </button>
              <button
                value="9"
                onClick={handleButtonClick}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300"
              >
                9
              </button>
              <button
                value="4"
                onClick={handleButtonClick}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300"
              >
                4
              </button>
              <button
                value="5"
                onClick={handleButtonClick}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300"
              >
                5
              </button>
              <button
                value="6"
                onClick={handleButtonClick}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300"
              >
                6
              </button>
              <button
                value="1"
                onClick={handleButtonClick}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300"
              >
                1
              </button>
              <button
                value="2"
                onClick={handleButtonClick}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300"
              >
                2
              </button>
              <button
                value="3"
                onClick={handleButtonClick}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300"
              >
                3
              </button>
              <button
                value="0"
                onClick={handleButtonClick}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300 col-span-2"
              >
                0
              </button>
              <button
                className="bg-[var(--secondary-color)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300"
                onClick={clearInput}
              >
                Clear
              </button>
            </div>
            <div className="flex justify-center items-center space-x-4">
              <button
                type="submit"
                className="bg-[var(--primary-color)] text-[var(--text-color2)] p-2 rounded hover:bg-[var(--accent-color)] transition duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
