"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    try {
      // Sign up with Appwrite && create plain link token

      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data?.email,
          password: data?.password,
        });
        if (response) router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className=" auth-form">
      <header className=" flex flex-col gap-5 md:gap-8">
        <Link href="/" className=" cursor-pointer items-center gap-1 flex">
          <Image src="/icons/logo.svg" width={34} height={34} alt="Logo" />
          <h1 className=" sidebar-logo text-26 font-ibm-plex-serif font-bold text-black-1">
            Fabank
          </h1>
        </Link>

        <div className=" flex flex-col gap-1 md:gap-3">
          <h1 className=" text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link account" : type === "sign-in" ? "Sign In" : "Sign Up"}

            <p className=" text-16 font-normal text-gray-600 mt-1">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>

      {user ? (
        <div className=" flex flex-col gap-4">hi</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className=" flex gap-4">
                    <CustomInput
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                      control={form.control}
                    />
                    <CustomInput
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                      control={form.control}
                    />
                  </div>
                  <CustomInput
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                    control={form.control}
                  />
                  <CustomInput
                    name="city"
                    label="City"
                    placeholder="Enter your City"
                    control={form.control}
                  />
                  <div className=" flex gap-4">
                    <CustomInput
                      name="state"
                      label="State"
                      placeholder="Example: TB"
                      control={form.control}
                    />
                    <CustomInput
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Example: 1101"
                      control={form.control}
                    />
                  </div>
                  <div className=" flex gap-4">
                    <CustomInput
                      name="DateOfBirth"
                      label="Date Of Birth"
                      placeholder="YYYY/MM/DD"
                      control={form.control}
                    />
                    <CustomInput
                      name="ssn"
                      label="SSN"
                      placeholder="Example: 1234"
                      control={form.control}
                    />
                  </div>
                </>
              )}

              <CustomInput
                name="email"
                label="Email"
                placeholder="Enter your Email"
                control={form.control}
              />
              <CustomInput
                name="password"
                label="Password"
                placeholder="Enter your Password"
                control={form.control}
              />

              <div className=" flex flex-col gap-4">
                <Button
                  className=" form-btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className=" animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className=" flex justify-center gap-1">
            <p className=" text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className=" form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
