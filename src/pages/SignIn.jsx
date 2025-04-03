import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import { checkValidSignInFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [load, setLoad] = useState("");
	const [isShow, setIsShow] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const logInUser = (e) => {
		// SignIn ---
		toast.loading("Wait until you SignIn");
		e.target.disabled = true;
		fetch(`https://chatback-gleq.onrender.com/api/auth/signin`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
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
					localStorage.setItem("token", json.token);
					dispatch(addAuth(json.data));
					navigate("/");
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
	const handleLogin = (e) => {
		if (email && password) {
			const validError = checkValidSignInFrom(email, password);
			if (validError) {
				toast.error(validError);
				return;
			}
			setLoad("Loading...");
			logInUser(e);
		} else {
			toast.error("Required: All Fields");
		}
	};
	return (
		<div className="flex flex-col items-center my-6 text-black bg-white min-h-[80vh]">
			<div className="p-3 w-[50%] sm:w-[40%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[1000px] rounded-lg h-fit  mt-5 transition-all">
				<h2 className="text-2xl  font-semibold  w-full text-black text-center mb-4">
					SignIn
				</h2>
				<form className="w-full flex justify-between flex-col">
					<h3 className="text-xl font-semibold p-1">
						Enter Email 
					</h3>
					<input
						className="w-full  py-4 px-8 rounded flex justify-between bg-white text-black "
						type="email"
						placeholder="Enter Email Address"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<h3 className="text-xl font-semibold p-1">
						Enter Password
					</h3>
					<div className="relative">
						<input
							className="w-full my-3 py-4 px-8 rounded flex justify-between bg-white text-black "
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
							e.preventDefault();
							handleLogin(e);
						}}
						className="disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold hover:text-black hover:bg-white rounded px-5 py-4 mt-5 text-lg  text-white hover:text-black bg-indigo-600 transition-all"
					>
						{load == "" ? "SignIn" : load}
					</button>
					<div className="w-full flex items-center mt-3">
						<div className="w-full h-[1px] "></div>
						<Link to={"#"}>
							<div className="p-3 font-semibold text-md hover:text-white whitespace-nowrap">
								Forgot Password
							</div>
						</Link>
						<div className="w-full h-[1px] bg"></div>
					</div>
					<div className="w-full flex items-center my-3">
						<div className="w-full h-[1px] "></div>
						<Link to="/signup">
							<div className="p-3 font-semibold text-md hover:text-white">
								SignUp
							</div>
						</Link>
						<div className="w-full h-[1px] "></div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
