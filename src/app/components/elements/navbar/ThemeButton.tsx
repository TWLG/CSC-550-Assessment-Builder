import {useTheme} from "./ThemeContext";

export default function ThemeButton({className}: {className: string}) {
  const {currentThemeIndex, setCurrentThemeIndex, themes} = useTheme();

  function handleClick() {
    const root = document.documentElement;
    root.classList.remove(themes[currentThemeIndex]);
    const newIndex = (currentThemeIndex + 1) % themes.length;
    setCurrentThemeIndex(newIndex);
    root.classList.add(themes[newIndex]);
    localStorage.setItem("themeIndex", newIndex.toString());
  }

  return (
    <a onClick={handleClick} className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 512 512"
        className="fill-current"
      >
        <path d="M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
      </svg>
    </a>
  );
}
