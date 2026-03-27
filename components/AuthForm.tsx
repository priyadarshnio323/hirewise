
"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";



import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

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
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <h2 className="text-primary-100">HireWise</h2>
        </div>

        <h3 className="text-center">Ace your job interviews with AI</h3>

        <Form {...form}>
          <form
  onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
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
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "Don't have an account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
