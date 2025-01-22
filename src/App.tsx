import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import logo from "@/assets/umami-logo.svg";

function App() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check initial state
    const disabled = localStorage.getItem("umami.disabled");
    setIsEnabled(disabled !== null);
  }, []);

  const toggleTracking = (checked: boolean) => {
    setIsAnimating(true);
    if (checked) {
      localStorage.setItem("umami.disabled", "1");
    } else {
      localStorage.removeItem("umami.disabled");
    }
    setIsEnabled(checked);
    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="min-w-[400px] p-4 bg-white shadow text-center">
      <h1 className="text-sm uppercase font-bold mb-4 text-gray-800 flex gap-2 justify-center items-center ">
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
