import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "./components/ui/button";

import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">hello</h1>
      <Button>button</Button>
    </div>
  );
}

export default App;
