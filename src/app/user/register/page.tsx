"use client";
import React, { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
// auth
import { signIn } from "next-auth/react";
// components
import InputLabel from "@components/formComponents/inputLabel";
import toast from "react-hot-toast";

type RegisterData = {
  name: string;
  email: string | null;
  password: string;
};

const Register = () => {
  const mutation = useMutation({
    mutationFn: (data: RegisterData) => {
      return fetch(`/api/user/register`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSettled: (data) => {
      if (data?.status === 201) {
        toast.success("User created.", { duration: 4000 });
        signIn();
      }
      if (data?.status === 401) {
        toast.error("Try another username.");
      }
      if (data?.status === 500) {
        toast.error("Try again later.");
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    var email = formData.get("email") as string | null;
    const password = formData.get("password") as string;
    const confirmPass = formData.get("confirm_password") as string;
    if (name && password && confirmPass && password === confirmPass) {
      if (email === "") {
        email = null;
      }
      const data = {
        name,
        email,
        password,
      };

      mutation.mutateAsync(data);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <form onSubmit={handleSubmit} className="flex flex-col p-4 gap-3">
        <InputLabel name="Name / Username" />
        <input type="text" name="name" required minLength={3} maxLength={30} />
        <InputLabel name="email" />
        <input type="text" name="email" maxLength={60} />
        <InputLabel name="password" />
        <input
          type="password"
          name="password"
          required
          minLength={6}
          maxLength={60}
        />
        <InputLabel name="confirm password" />
        <input
          type="password"
          name="confirm_password"
          required
          minLength={6}
          maxLength={60}
        />
        <button className="mt-4" disabled={mutation.isPending} type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
