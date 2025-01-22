import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import logo from "@/assets/umami-logo.svg";

function App() {
  const [isEnabled, setIsEnabled] = useState(true);
  const { t } = useTranslation();

  const updateIcon = (enabled: boolean) => {
    const color = enabled ? "red" : "gray";
    chrome.action.setIcon({
      path: {
        "16": `assets/icon-16-${color}.png`,
        "32": `assets/icon-32-${color}.png`,
        "48": `assets/icon-48-${color}.png`,
        "128": `assets/icon-128-${color}.png`,
      },
    });
  };

  useEffect(() => {
    // Check initial state from the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
      if (tab.id) {
        const [{ result }] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => localStorage.getItem("umami.disabled"),
        });
        const enabled = result !== null;
        setIsEnabled(enabled);
        updateIcon(enabled);
      }
    });
  }, []);

  const toggleTracking = async (checked: boolean) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    if (tab.id) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (checked) => {
          if (checked) {
            localStorage.setItem("umami.disabled", "1");
          } else {
            localStorage.removeItem("umami.disabled");
          }
        },
        args: [checked],
      });
      setIsEnabled(checked);
      updateIcon(checked);
    }
  };

  return (
    <div className="w-full p-4 bg-white shadow text-center">
      <h1 className="text-sm uppercase font-bold mb-4 text-gray-800 flex gap-2 justify-center items-center">
        <img src={logo} alt="Umami Logo" className="w-4" />
        {t("title")}
      </h1>
      <p>{t("description")}</p>
      <div className="flex items-center justify-center text-3xl gap-2 mt-4">
        <span>😏</span>
        <Switch checked={isEnabled} onCheckedChange={toggleTracking} />
        <span>🫣</span>
      </div>
      <div className="h-12 relative">
        <p
          className={`text-sm text-red-500 mt-2 absolute w-full transition-all duration-500 ease-in-out ${
            isEnabled ? "opacity-100 blur-none" : "opacity-0 blur-md"
          }`}
        >
          {t("statusOff")}
        </p>
        <p
          className={`text-sm text-gray-400 mt-2 absolute w-full transition-all duration-500 ease-in-out ${
            !isEnabled ? "opacity-100 blur-none" : "opacity-0 blur-md"
          }`}
        >
          {t("statusOn")}
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {t("madeWithLove")}{" "}
        <a href="https://taap.it/jglinkedin" className="underline">
          Jérémie Gisserot
        </a>
      </p>
    </div>
  );
}

export default App;
