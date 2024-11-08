import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { useAuthStore } from "@/stores/auth";
import useChangePassword from "@/hooks/use-change-password";

const ProfileModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const { user } = useAuthStore();
	const [showPasswordChange, setShowPasswordChange] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	if (!user) return;
	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setShowPasswordChange(false);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 z-50"
						onClick={onClose}
					/>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 flex items-center justify-center z-50"
					>
						<Card className="w-full max-w-md mx-auto">
							<CardHeader>
								<CardTitle>User Profile</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex flex-col items-center space-y-4">
									<Avatar className="h-24 w-24">
										<AvatarImage src={""} alt={user.username} />
										<AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-500">
											{user.username
												.split(" ")
												.map((n) => n[0])
												.join("")
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="text-center">
										<p className="text-xl font-semibold">{user.username}</p>
									</div>
								</div>

								{!showPasswordChange ? (
									<Button
										onClick={() => setShowPasswordChange(true)}
										className="w-full"
									>
										Change Password
									</Button>
								) : (
									<form onSubmit={handlePasswordChange} className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="current-password">Current Password</Label>
											<Input
												id="current-password"
												type="password"
												value={currentPassword}
												onChange={(e) => setCurrentPassword(e.target.value)}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="new-password">New Password</Label>
											<Input
												id="new-password"
												type="password"
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="confirm-password">
												Confirm New Password
											</Label>
											<Input
												id="confirm-password"
												type="password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												required
											/>
										</div>
										<div className="flex justify-end space-x-2">
											<Button
												type="button"
												variant="outline"
												onClick={() => setShowPasswordChange(false)}
											>
												Cancel
											</Button>
											<Button type="submit">Change Password</Button>
										</div>
									</form>
								)}
							</CardContent>
							<CardFooter className="flex justify-end">
								<Button variant="outline" onClick={onClose}>
									Close
								</Button>
							</CardFooter>
						</Card>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default ProfileModal;
