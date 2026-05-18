
"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "animate.css";


import { Form } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";

import FormField from "./FormField";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) =>
  z.object({
    name: z
      .string()
      .optional()
      .refine(
        (val) => type !== "sign-up" || (val && val.length >= 3),
        {
          message: "Name must be at least 3 characters",
        }
      ),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
  });


const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    password: "",
    ...(type === "sign-up" && { name: "" }),
    },
    shouldUnregister : true,
  });

  

  const isSignIn = type === "sign-in";

  async function onSubmit (data: z.infer<typeof formSchema>)  {
  console.log(data.email, data.name);
  try{
    if(type === 'sign-up'){
    const {name, email, password} = data;
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
    const result = await signUp({
      uid : userCredentials.user.uid,
      name : name!,
      email,
      password
    })
    if(!result?.success){
      toast.error(result?.message);
      return;
    }

    toast.success('Account created successfully. Please sign in.');
    router.push('/sign-in');
  }else{
    const {email, password} = data;
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredentials.user.getIdToken();
    if(!idToken){
      toast.error('Sign in failed');
      return;
    }
    await signIn({
      email, idToken
    })
    toast.success('Sign in successful');
    router.push('/');
    }
  }catch(error: any){
  console.log("Full error:", error);
  console.log("Error code:", error.code);
  console.log("Error message:", error.message);
  console.log(error);
  toast.error(`There was an error: ${error}`);

  toast.error(error.code || "Something went wrong");
}

};


  return (
  <div className="min-h-screen flex">

    {/* LEFT */}
    <div className="hidden lg:flex w-1/2 flex-col justify-center px-20 bg-gradient-to-br from-green-800 to-green-900">
      <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight animate__animated animate__fadeInUp">
  HireWise
</h1>

<p className="text-2xl text-gray-200 mb-8 leading-relaxed max-w-lg animate__animated animate__fadeInUp animate__delay-1s">
  Ace your{" "}
  <span className="text-[#D4E157] font-semibold">
    job interviews
  </span>{" "}
  with AI-powered mock sessions, instant feedback, and smart insights.
</p>
    
    </div>

    {/* RIGHT */}
    <div className="w-full lg:w-1/2 max-w-[720px] lg:max-w-none mx-auto flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-gradient-to-br from-blue-50 to-white">
      
      <h2 className="text-4xl font-bold mb-3 text-gray-800">
        {isSignIn ? "Welcome Back" : "Create Account"}
      </h2>

      <p className="text-lg text-gray-600 mb-8">
        {isSignIn
          ? "Login to continue"
          : "Start your interview journey"}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="form space-y-6 w-full max-w-md "
        >
          {!isSignIn && (
            <FormField
              control={form.control}
              name="name"
              label="Name"
              placeholder="Your Name"
              type="text"
            />
          )}

          <FormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Your email"
            type="email"
          />

          <div className="relative">
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 size-8 top-7.5 text-gray-500 hover:text-gray-700 xs-hidden"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </Form>

      <p className="text-base mt-8 text-gray-600">
        {isSignIn
          ? "Don't have an account?"
          : "Already have an account?"}
        <Link
          href={!isSignIn ? "/sign-in" : "/sign-up"}
          className="text-blue-600 ml-2 font-semibold"
        >
          {!isSignIn ? "Sign In" : "Sign Up"}
        </Link>
      </p>

    </div>
  </div>
);
};

export default AuthForm;
