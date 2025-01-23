/**
 * login 登录页面
 * @author caoguangyao
 */
import { Button } from "@/components/ui/button"; // 假设shadcn/ui的Button组件路径为 "@/components/ui/button"

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Login page</h1>
      <Button variant="outline" className="w-full max-w-sm">
        <svg className="mr-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0C4.477 0 0 4.477 0 10c0 2.761 1.193 5.183 3.006 6.859v-5.637h-1.665v-2h3.333v-.861C3.333 4.826 6.254 2 10 2c4.418 0 8 3.582 8 8 0 3.537-2.292 6.539-5.438 7.894l-.354-.314a2.007 2.007 0 0 0-1.414 0l-.354.314C5.292 15.539 3 12.537 3 8c0-4.418 3.582-8 8-8z" />
          <path d="M13.584 10l.354.314a2.007 2.007 0 0 0 1.414 0l.354-.314c.39-.369.597-.87.597-1.414s-.208-1.045-.597-1.414a2.014 2.014 0 0 0-2.414 0l-.354.314c-.39.369-.597.87-.597 1.414s.208 1.045.597 1.414zM10 16c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z" />
        </svg>
        Sign in with GitHub
      </Button>
      <form className="mt-8 space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <Button type="submit" className="w-full max-w-sm">
          Sign in
        </Button>
      </form>
    </div>
  );
}
