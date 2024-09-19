"use client";

import React, { type FormEvent, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import type { TResponse, TUser } from "@/types";
import { useAuthStore } from "@/stores/auth";

const SignInCard = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const router = useRouter();

	const { setAuthStore } = useAuthStore();

	const handleSubmitData = async () => {
		const signInData: Omit<TUser, "userImage" | "username"> = {
			email,
			password,
		};
		try {
			setLoading(() => true);
			const { data } = await axios.post<TResponse>(
				"http://localhost:3001/api/auth/sign-in",
				signInData,
				{
					withCredentials: true,
				},
			);
			console.log(data);

			setLoading(() => false);
			setMessage(() => data.message);
			setAuthStore({ _id: data.data._id, username: data.data.username });
			localStorage.setItem("axon_user", JSON.stringify(data.data));

			router.push("/home");
		} catch (error) {
			if (error instanceof AxiosError) {
				setError(error.response?.data.message);
				setTimeout(() => {
					setError("");
				}, 5000);

				setLoading(() => false);
			}
		}
	};

	const sendData = async (e: FormEvent) => {
		e.preventDefault();
		if (email.trim() === "" || password.trim() === "") {
			console.log("Please fill out all fields");
			return;
		}

		await handleSubmitData();
	};

	return (
		<Card className="px-[20px] border-neutral-700 text-white bg-customMain rounded-[12px] py-[40px] w-[450px]">
			<CardHeader>
				<CardTitle className="text-center text-[20px]">
					Sign in to axon
				</CardTitle>
				<CardDescription className="text-center">
					Don&apos;t have an account? &nbsp;
					<Link href="/auth/sign-up" className="hover:underline">
						Sign up
					</Link>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={sendData} className="w-full gap-[15px] flex flex-col">
					<Input
						className="bg-neutral-900 text-[15px] border-neutral-700 rounded-[8px] focus-visible:ring-0 focus-visible:ring-transparent"
						type="email"
						disabled={loading}
						placeholder="Enter your email"
						required
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						className="bg-neutral-900 text-[15px] border-neutral-700 rounded-[8px] focus-visible:ring-0 focus-visible:ring-transparent"
						type="password"
						disabled={loading}
						placeholder="Enter your password"
						required
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button type="submit" variant="axon" disabled={false}>
						{loading ? "Signing in.." : "Sign in"}
					</Button>
					{error && <p className="text-red-500 text-center">{error}</p>}
					{message !== "" && (
						<p className="text-green-500 text-center">{message}</p>
					)}
				</form>
			</CardContent>
			<CardContent>
				<Separator className="bg-neutral-700" />
			</CardContent>
			<CardFooter>
				<Button
					type="button"
					className="w-full relative"
					variant="axon"
					disabled={false}
				>
					<div className="absolute left-[15px]">
						<FcGoogle />
					</div>
					Sign in with Google
				</Button>
			</CardFooter>
		</Card>
	);
};

export default SignInCard;
