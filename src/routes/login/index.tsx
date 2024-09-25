import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginMsg, setLoginMsg] = useState('')

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('greet', { name: username }))
  }

  async function testLogin() {
    await invoke('login', { username, password })
      .then((res) => {
        setLoginMsg(res as string)
      })
      .catch((err) => {
        setLoginMsg(err as string)
      })
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white shadow-lg p-16 text-center rounded-md w-1/3 min-w-96">
        <Link to=".." className="w-full text-left flex p-0">
          <Button type="reset" variant="link" className="w-fit text-left p-0">
            <ChevronLeft size={24} className="text-black" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-center">Đăng nhập</h1>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tên đăng nhập"
          className="my-4"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          className="my-4"
        />
        <div className="w-full flex gap-2">
          <Button onClick={greet} className="w-1/2 bg-red-400 hover:bg-red-500">
            greet
          </Button>
          <Button
            onClick={testLogin}
            className="w-1/2 bg-blue-400 hover:bg-blue-500"
          >
            login
          </Button>
        </div>
        <p>{greetMsg}</p>
        <p className="text-blue-500">{loginMsg}</p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/login/')({
  component: App,
})
