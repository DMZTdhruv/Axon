"use client";

import { type FormEvent, useState } from "react";
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
import { useAuthStore } from "@/stores/auth";
import useSign from "@/app/hooks/useSign";

const SignUpCard = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const router = useRouter();

	const { sendSignUpData } = useSign();

	const [localUsername, setLocalUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const { setAuthStore, username, _id } = useAuthStore();

	const signUp = async () => {
		setLoading(() => true);
		try {
			const data = await sendSignUpData({ email, username, password });
			if (!data) throw new Error("No response received from the server");
			if (data?.message) {
				setMessage(data.message);
			}
			setAuthStore({ _id: data.data._id, username: data.data.username });
			localStorage.setItem("axon_user", JSON.stringify(data.data));
			setLoading(() => false);
			router.push("/");
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			}
			setLoading(() => false);
		}
	};

	const sendData = async (e: FormEvent) => {
		e.preventDefault();
		if (
			email.trim() === "" ||
			localUsername.trim() === "" ||
			password.trim() === ""
		) {
			return;
		}

		await signUp();
	};

	return (
		<Card className="px-[20px] text-white border-neutral-700 bg-customMain rounded-[12px] py-[40px] w-[450px]">
			<CardHeader>
				<CardTitle className="text-center text-[20px]">
					Sign up to axon
				</CardTitle>
				<CardDescription className="text-center">
					Already have an account? &nbsp;
					<Link href="/auth/sign-in" className=" hover:underline">
						Sign in
					</Link>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={sendData} className="w-full gap-[15px] flex flex-col ">
					<Input
						className=" bg-neutral-900 border-neutral-700 text-[15px] rounded-[8px]  focus-visible:ring-0 focus-visible:ring-transparent"
						type="email"
						disabled={loading}
						value={email}
						placeholder="Enter your email"
						required
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						className="  bg-neutral-900 border-neutral-700 text-[15px] rounded-[8px] focus-visible:ring-0 focus-visible:ring-transparent"
						type="text"
						disabled={loading}
						value={localUsername}
						placeholder="Enter your username"
						required
						onChange={(e) => setLocalUsername(e.target.value)}
					/>
					<Input
						className=" bg-neutral-900 border-neutral-700 text-[15px]  rounded-[8px] focus-visible:ring-0 focus-visible:ring-transparent"
						type="password"
						disabled={loading}
						value={password}
						placeholder="Enter your password"
						required
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button type="submit" variant="axon" disabled={loading}>
						{loading ? "Submitting" : "Submit"}
					</Button>
				</form>
				{error && <p className="text-red-500 text-center">{error}</p>}
				{message !== "" && (
					<p className="text-green-500 text-center">Signed up successfully</p>
				)}
			</CardContent>
			<CardContent>
				<Separator className="bg-neutral-700" />
			</CardContent>
			<CardFooter>
				<Button
					type="submit"
					className="w-full relative"
					variant="axon"
					disabled={false}
				>
					<div className="absolute left-[15px]">
						<FcGoogle />
					</div>
					Sign up with google
				</Button>
			</CardFooter>
		</Card>
	);
};

export default SignUpCard;
