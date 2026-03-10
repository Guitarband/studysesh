"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const loginSchema = z.object({
	email: z.email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required")
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
	const router = useRouter();


	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		}
	});

	const onSubmit = async (values: LoginFormValues) => {
		await authClient.signIn.email(
			{
				email: values.email,
				password: values.password
			},
			{
				onSuccess: () => {
					toast.success("Login successful!", { duration: 1000 })
					router.push("/dashboard");
				},
				onError: (ctx) => {
					toast.error(`Login failed: ${ctx.error.message}`);
				}
			}
		)
	}

	const isPending = form.formState.isSubmitting;

	return (
		<div className="h-full font-garamond flex flex-col items-start justify-center bg-[#f8fcE8] p-8 gap-10 rounded-r-xl">
			<h1 className="text-5xl font-medium text-[#8CB369]">Welcome Back!</h1>
			<Form {...form}>
				<form className="w-3/4" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xl text-muted-foreground">Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="name@example.com"
												className="md:text-lg md:h-10  border-[#8CB369] focus-visible:ring-[#8CB369]/50 bg-white/40 border-2"
												{...field}
											/>
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
										<FormLabel className="text-xl text-muted-foreground">Password</FormLabel>
										<FormControl >
											<Input
												type="password"
												placeholder="********"
												className="md:text-lg md:h-10 border-[#8CB369] focus-visible:ring-[#8CB369]/50 bg-white/40 border-2"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="w-full md:text-lg md:h-12 bg-[#8CB369]"
								disabled={isPending}
							>
								Login
							</Button>
						</div>
						<div className="text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link
								href="/signup"
								className="underline underline-offset-4 text-[#8CB369]"
							>
								Sign up
							</Link>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)

}