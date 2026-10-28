import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { scheduleTokenExpiry } from "../../utils/tokenExpiry";
import { Eye, EyeClosed } from "lucide-react";
import Button from "../../components/Button/Button";
import "./login.css";
import wemaLogo from "../../assets/images/wema-logo.png";
import wema from "../../assets/images/wema.png";
import subtract from "../../assets/images/Subtract.png";
import ellipse70 from "../../assets/images/Ellipse-70.png";
import ellipse72 from "../../assets/images/Ellipse-72.png";
import ellipse73 from "../../assets/images/Ellipse-73.png";
import ellipse69 from "../../assets/images/Ellipse-69.png";
import { useLogin } from "../../hooks/useLogin";
import toast from "react-hot-toast";

function Login() {
  const [showSplash, setShowSplash] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending } = useLogin();
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email");
      return;
    }

    mutate(
      {
        email: trimmedEmail,
        password,
      },
      {
        onSuccess: (res) => {
          setLoginSuccessful(true);

          if (rememberMe) {
            localStorage.setItem("token", res.accessToken);
            sessionStorage.removeItem("token");
          } else {
            sessionStorage.setItem("token", res.accessToken);
            localStorage.removeItem("token");
          }
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem(
            "user",
            JSON.stringify({
              email: res.email,
              role: res.role,
              fullName: res.fullName,
              staffID: res.staffId,
              time: new Date().toLocaleString(),
            }),
          );
          scheduleTokenExpiry(res.accessToken);
          toast.success("Login successful");
          setTimeout(() => {
            setShowSplash(true);
          }, 1500);
          setTimeout(() => {
            if (res.role == "User") {
              navigate("/profile");
            } else {
              navigate("/dashboard");
            }
          }, 2900);
          setTimeout(() => {
            setShowSplash(false);
          }, 3000);
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            const message =
              error.response?.data?.message ||
              "Login failed. Please try again.";

            toast.error(message);
          } else {
            toast.error("An unexpected error occured.");
          }
        },
      },
    );
  };

  const splashText = "Welcome to SWAMP".split("");

  return (
    <div className="overflow-hidden relative min-h-screen">
      {showSplash && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2e0e27] animate-fade-in">
          <h1 className="text-[#f0f4f7] text-4xl md:text-6xl font-bold tracking-wide flex flex-wrap justify-center">
            {splashText.map((char, index) => (
              <span
                key={index}
                className="inline-block animate-letter-bounce"
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
        </div>
      )}

      {/* left part */}
      <div className="h-screen w-7/10 relative picture-div">
        <div className="h-full w-full z-100 bg-[#8c0f76] top-0 left-0 opacity-10 absolute"></div>
        <img src={wema} alt="" className="h-full w-full absolute" />
        <div className="flex h-full items-center">
          <img
            src={wemaLogo}
            alt=""
            className="fixed left-30 w-[35%] z-103 logo"
          />
        </div>
      </div>

      {/* right part */}
      <div className="h-screen w-5/10 z-101 fixed top-0 right-0 subtract-div subtract-div-2">
        <img src={subtract} alt="" className="w-full h-full" />
      </div>
      <div className="h-screen w-5/10 z-101 fixed top-0 right-0 subtract-div subtract-div-1">
        <img src={subtract} alt="" className="w-full h-full" />
        <div className="w-1/4 h-3/3 flex items-start justify-center overflow-hidden fixed right-10 top-10 z-103 form-div">
          {/* Form */}
          <div className="relative z-10 w-[340px] form">
            <form onSubmit={handleLogin}>
              <div className="w-full flex flex-col justify-start items-start form-header-div">
                <h2 className="text-center text-[#7d126d] text-[40px] font-bold">
                  Login to your
                </h2>
                <h2 className="text-center text-[#7d126d] text-[40px] font-bold">
                  Account!
                </h2>
              </div>

              <div className="mt-12 space-y-5">
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[48px] border border-gray-300 rounded px-4 outline-none focus:border-[#a00088] bg-white"
                />

                <div className="w-full h-[48px] border border-gray-300 rounded px-4 outline-none  focus-within:border-[#a00088] bg-white flex items-center justify-between">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-full outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {!showPassword ? (
                      <Eye className="text-[#969393]" />
                    ) : (
                      <EyeClosed className="text-[#969393]" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#7d126d]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </div>

                <Button
                  type="submit"
                  className="submit w-full"
                  disabled={isPending || loginSuccessful}
                >
                  {loginSuccessful
                    ? "Logged in"
                    : isPending
                      ? "Logging in..."
                      : "Submit"}
                </Button>
              </div>
            </form>
            <p className="text-black">
              Don't have an account?{" "}
              <Link to="signup" className="text-[#711460]">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ellipses at the bottom right corner */}
      <div className="relative -bottom-10 z-102">
        <img src={ellipse70} alt="" className="absolute bottom-0 right-0" />
        <img src={ellipse72} alt="" className="absolute bottom-0 right-0" />
        <img src={ellipse73} alt="" className="absolute bottom-0 right-0" />
        <img src={ellipse69} alt="" className="absolute bottom-0 right-0" />
      </div>
    </div>
  );
}

export default Login;
