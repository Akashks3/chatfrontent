import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkValidSignUpFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignUp = () => {
	const [firstName, setFirstName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [load, setLoad] = useState("");
	const [isShow, setIsShow] = useState(false);
	const navigate = useNavigate();

	const signUpUser = (e) => {
		// Signup ---
		toast.loading("Wait until you SignUp");
		e.target.disabled = true;
		fetch(`https://chatback-gleq.onrender.com/api/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstName: firstName,
				email: email,
				password: password,
			}),
		})
			.then((response) => response.json())
			.then((json) => {
				setLoad("");
				e.target.disabled = false;
				toast.dismiss();
				if (json.token) {
					navigate("/signin");
					toast.success(json?.message);
				} else {
					toast.error(json?.message);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				setLoad("");
				toast.dismiss();
				toast.error("Error : " + error.code);
				e.target.disabled = false;
			});
	};
	const handleSignup = (e) => {
		if (firstName && email && password) {
			const validError = checkValidSignUpFrom(
				firstName,
				email,
				password
			);
			if (validError) {
				toast.error(validError);
				return;
			}
			setLoad("Loading...");
			signUpUser(e);
		} else {
			toast.error("Required: All Fields");
		}
	};
	return (
		<div className="flex flex-col items-center my-6 text-black bg-white min-h-[80vh]">
			<div className="p-3 w-[70%] sm:w-[50%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[1000px]  rounded h-fit  mt-5 transition-all">
				<h2 className="text-2xl  font-semibold text-black w-full text-center mb-4">
					SignUp
				</h2>
				<form className="w-full flex justify-between flex-col">
					<h3 className="text-xl font-semibold p-1">
						Enter First Name
					</h3>
					<input
						className="w-half border border-slate-700 my-3 py-4 px-8 rounded flex justify-between bg-white text-black "
						type="text"
						placeholder="Enter First Name"
						name="firstName"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
				
					<h3 className="text-xl font-semibold p-1">
						Enter Email Address
					</h3>
					<input
						className="w-full border border-slate-700 my-3 py-4 px-8 rounded flex justify-between bg-white text-black "
						type="email"
						placeholder="Enter Email Address"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<h3 className="text-xl font-semibold p-1">
						Enter Password
					</h3>
					<div className="relative">
						<input
							className="w-full border border-slate-700 my-3 py-4 px-8 rounded flex justify-between bg-white text-black "
							type={isShow ? "text" : "password"}
							placeholder="Enter Password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span
							onClick={() => setIsShow(!isShow)}
							className="cursor-pointer text-black/80 absolute right-5 top-8"
						>
							{isShow ? (
								<PiEyeClosedLight fontSize={22} />
							) : (
								<PiEye fontSize={22} />
							)}
						</span>
					</div>
					<button
						onClick={(e) => {
							handleSignup(e);
							e.preventDefault();
						}}
						className="disabled:opacity-50 disabled:cursor-not-allowed w-full text-white font-semibold hover:bg-white hover:text-slate-700  rounded px-5 py-4 mt-5 text-lg   text-slate-400 hover:text-white bg-indigo-600 transition-all"
					>
						{load == "" ? "SignUp" : load}
					</button>
					<div className="w-full flex items-center my-3">
						<div className="w-full h-[1px] "></div>
						<Link to="/signin">
							<div className="p-3 font-semibold text-md hover:text-white">
								SignIn
							</div>
						</Link>
						<div className="w-full h-[1px] "></div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
