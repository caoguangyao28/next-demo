'use client'
import AuthCard from "@/components/auth/AuthCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { loginSchema } from '@/types/login-schema';
import { z } from "zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { emailSign } from "@/server/actions/email-signin";
import { useAction } from "next-safe-action/hooks";
import {cn} from "@/lib/utils";
export const LoginForm = () => {
  const form = useForm({ // muset be 'use client'
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const { execute, status, result } = useAction(emailSign)
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    await execute(values);
    console.log(result)
  }
  return (
    <AuthCard
      cardTile={'Welcome to blogs'}
      backButtonHref={'/auth/register'}
      backButtonLable={'create a new account'}
      showSocials = {true}
    >
    <div>
      <Form {...form}>
        <form method={'POST'} onSubmit={form.handleSubmit(onSubmit)} >
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="develop@email.com" type="email" autoComplete="email"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" autoComplete="current-password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size={'sm'} variant={'link'} asChild>
              <Link href={'/auth/reset'}>
                <span>忘记密码</span>
              </Link>
            </Button>
          </div>
          <Button
            type={'submit'}
            className={cn('w-full my-2', status === 'executing' ? 'animate-pulse' : '')}>
            {'登录'}
          </Button>
        </form>
      </Form>
    </div>
    </AuthCard>
  )
}
