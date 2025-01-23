/**
 * login 登录页面
 * @author caoguangyao
 */
import {LoginForm} from "@/components/auth/LoginForm";

export const metadata = {
  title: 'Login',
  description: 'Login page',
};

export default function Login() {
  return (
    <LoginForm />
  );
}
