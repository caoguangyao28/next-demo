'use client'
import AuthCard from "@/components/auth/AuthCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { registerSchema } from '@/types/login-schema';
import { z } from "zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { emailRegister } from "@/server/actions/email-register";
import { useAction } from "next-safe-action/hooks";
import {cn} from "@/lib/utils";
import {useState} from "react";
export const RegisterForm = () => {
  const form = useForm({ // muset be 'use client'
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  });

  const [error, setError] = useState('')
  const { execute, status } = useAction(emailRegister, {
    onError: (error) => {
      console.log(error)
    },
    onSuccess: (data) => {
      console.log(data)
    }
  })
  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    await execute(values);
  }
  return (
    <AuthCard
      cardTile={'Create an new account'}
      backButtonHref={'/auth/login'}
      backButtonLable={'already have  an account? login here'}
      showSocials = {true}
    >
      <div>
        <Form {...form}>
          <form method={'POST'} onSubmit={form.handleSubmit(onSubmit)} >
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="developer" type="text"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              {'注册'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  )
}
