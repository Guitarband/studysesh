"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadAvatar } from "@/lib/profile-updater";

const signupSchema = z.object({
	name: z.string(),
	email: z.email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords must match",
	path: ["confirmPassword"]
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignUp() {
	const router = useRouter();


	const form = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		}
	});

	const onSubmit = async (values: SignupFormValues) => {
		await authClient.signUp.email(
			{
				name: values.name,
				email: values.email,
				password: values.password
			},
			{
				onSuccess: () => {
					uploadAvatar(new File([new Blob()], "default-avatar.png", { type: "image/png" })).catch((err) => {
						console.error("Failed to upload default avatar:", err);
					});
					toast.success("Signup successful!", { duration: 1000 })
					router.push("/dashboard");
				},
				onError: (ctx) => {
					toast.error(`Signup failed: ${ctx.error.message}`);
				}
			}
		)
	}

	const isPending = form.formState.isSubmitting;

	return (
		<div className="h-full font-garamond flex flex-col items-start justify-center bg-[#f8fcE8] p-8 gap-10 rounded-r-xl">
			<h1 className="text-5xl font-medium text-[#8CB369]">Sign up!</h1>
			<Form {...form}>
				<form className="w-3/4" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="gap-0">
										<FormLabel className="text-xl text-muted-foreground">Username</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Tomato"
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
								name="email"
								render={({ field }) => (
									<FormItem className="gap-0">
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
									<FormItem className="gap-0">
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
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem className="gap-0">
										<FormLabel className="text-xl text-muted-foreground">Confirm Password</FormLabel>
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
								className="w-full md:text-lg md:h-12 my-2 bg-[#8CB369]"
								disabled={isPending}
							>
								Sign up
							</Button>
						</div>

					</div>
				</form>
			</Form>
		</div>
	)

}