import { useState } from "react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#101718] dark:text-gray-100 min-h-screen">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">

        {/* LEFT SIDE – EXACT SAME AS LOGIN */}
        <div className="hidden lg:flex lg:w-[55%] academic-gradient relative overflow-hidden flex-col justify-between p-16">

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3 text-white">
            <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="material-symbols-outlined text-white">
                school
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Should I Bunk?
            </h2>
          </div>

          {/* Headline */}
          <div className="relative z-10">
            <h1 className="text-white text-5xl font-black leading-tight mb-6 max-w-lg">
              Master your schedule, manage your risk.
            </h1>
            <p className="text-white/80 text-xl font-light max-w-md leading-relaxed">
              A smart attendance decision system that helps you stay eligible
              without missing what matters.
            </p>
          </div>

          {/* Tags */}
          <div className="relative z-10 flex gap-4">
            <div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-md border border-white/20 text-white text-xs font-medium">
              #1 Attendance Tracker
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-md border border-white/20 text-white text-xs font-medium">
              Risk Assessment Engine
            </div>
          </div>

          {/* Decorative SVG */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <svg className="scale-150 origin-center" fill="none" viewBox="0 0 800 800">
              <circle cx="400" cy="400" r="300" stroke="white" strokeDasharray="20 20" strokeWidth="2" />
              <circle cx="400" cy="400" r="200" stroke="white" strokeWidth="1" />
              <rect width="400" height="400" x="200" y="200" transform="rotate(45 400 400)" stroke="white" strokeWidth="0.5" />
              <path d="M100 400L700 400M400 100L400 700" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>

          <div
            className="absolute bottom-0 right-0 w-[50%] h-[60%] bg-contain bg-no-repeat bg-right-bottom opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBv93adB_afnhkkIyQBVPAJ2LUa8wNZEIw9emqmrbBCTwcXXugVwrHFa9ogpuSwahWw0FFywRP91XuW36k7a9YPncwJW4K3ciB25o6_EQyT8AbZiQy-_jZnKowFNffpT9jZRpd76iF5WTii3t4C8Rn6V3DgKE3bSjX8YG14FQUQvKvE4rAuKgc7X1zZnstUMaY1br6XGee8cf-krgN09deFRO20Rxqud5s2g-_Y55uHTD6CwKCE4haYXHH3_e-SSCQSphwLluR48zsE")'
            }}
          />
        </div>

        

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col items-center justify-start lg:justify-center p-8 sm:p-12 lg:p-24">

          {/* Mobile Header – SAME AS LOGIN */}
          <div className="lg:hidden flex items-center gap-2 mb-12 self-start">
            <div className="size-10 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white">
                school
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Should I Bunk?
            </h2>
          </div>

          <div className="w-full max-w-[440px]">

            {/* Title */}
            <div className="mb-10">
              <h2 className="text-3xl font-black mb-2">
                Create Account
              </h2>
              <p className="text-[#5c808a] dark:text-gray-400">
                Sign up using your email.
              </p>
            </div>

            <form className="space-y-5">

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Karan Ambala"
                  className="w-full rounded-lg border border-[#d4dfe2] dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  className="w-full rounded-lg border border-[#d4dfe2] dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[#d4dfe2] dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              {/* <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[#d4dfe2] dark:border-gray-700 bg-white dark:bg-gray-800 h-12 px-4 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div> */}

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 accent-teal-600 cursor-pointer mt-1"
                />
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  I agree to the{" "}
                  <span className="text-primary font-semibold cursor-pointer">
                    Terms & Conditions
                  </span>
                </label>
              </div>

              {/* Button */}
              <button className="w-full flex items-center justify-center rounded-lg h-12 px-5 bg-[#337f94] hover:bg-[#255d6d] text-white text-base font-bold transition shadow-md">
                Create Account
              </button>
            </form>

            <p className="mt-10 text-center text-sm text-[#5c808a] dark:text-gray-400">
              Already have an account?
              <a
                href="/login"
                className="text-primary font-bold hover:underline ml-1"
              >
                Sign in
              </a>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
