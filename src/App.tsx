import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: username }));
  }

  async function testLogin() {
    await invoke("login", { username, password })
      .then((res) => { setLoginMsg(res as string); })
      .catch((err) => { setLoginMsg(err as string); });
  }

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div>
        <h1 className="text-3xl font-bold">test login function</h1>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="name"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <Button onClick={greet}>greet button</Button>
        <Button onClick={testLogin}>login</Button>
        <p>{greetMsg}</p>
        <p className="text-blue-500">{loginMsg}</p>
      </div>
    </div>
  );
}

export default App;
