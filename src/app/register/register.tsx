"use client";
import React, { FormEvent, useState, useEffect, useRef } from "react";
import Link from "next/link";
// react-query
import { useMutation } from "@tanstack/react-query";
// functions
import { delay } from "@functions";
// auth
import { signIn } from "next-auth/react";
// components
import PageContainer from "@components/pageContainer/pageContainer";
import InputLabel from "@components/formComponents/inputLabel";
import toast from "react-hot-toast";
// styles
import "./register.scss";
// icons
import { IoMdCloseCircle } from "react-icons/io";

type RegisterData = {
  name: string;
  email: string | null;
  password: string;
};

type PromptMessage = {
  prompt: string;
  doWrite?: boolean;
};

const Register = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPassRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

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

  const [promptMessages, setPromptMessages] = useState<PromptMessage[]>([
    { prompt: "register_new_user", doWrite: true },
  ]);

  const addPrompt = (message: string, doWrite?: boolean | undefined) => {
    const lastMessage = promptMessages[promptMessages.length - 1].prompt;
    if (lastMessage !== message) {
      const newMessage = {
        prompt: message,
        doWrite: doWrite === undefined ? true : false,
      };

      setPromptMessages([...promptMessages, newMessage]);
    }
  };

  const [formValues, setFormValues] = useState({
    name: "",
    password: "",
    confirm_password: "",
  });

  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    if (formValues.name.length > 2) {
      removeClassError(usernameRef);
      setClassOk(usernameRef);
    } else {
      removeClassOk(usernameRef);
    }
    if (formValues.password.length > 5) {
      removeClassError(passwordRef);
      setClassOk(passwordRef);
    } else {
      removeClassOk(passwordRef);
    }
    if (
      formValues.confirm_password.length > 5 &&
      formValues.password === formValues.confirm_password
    ) {
      removeClassError(confirmPassRef);
      setClassOk(confirmPassRef);
    } else {
      removeClassOk(confirmPassRef);
    }
    if (
      formValues.name.length > 2 &&
      formValues.password.length > 5 &&
      formValues.confirm_password.length > 5
    ) {
      console.log("submit enabled");
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
      console.log("submit disabled");
    }
  }, [formValues]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

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

  useEffect(() => {
    const waitNfocus = async () => {
      await delay(promptMessages[0].prompt.length * 40 + 300);
      if (usernameRef.current) {
        usernameRef.current.focus();
      }
    };
    waitNfocus();
  }, []);

  return (
    <PageContainer>
      <div className="register-machine w-96 bg-neutral-800">
        <Link href={"/"}>
          <IoMdCloseCircle
            className="pb-2 ml-auto"
            size={35}
            color="rgb(240, 240, 240)"
            fill="rgb(240, 240, 240)"
          />
        </Link>
        <div className="register-screen pixelate relative">
          {promptMessages.map((message, index, array) => {
            return (
              <PromptText
                key={index}
                active={index === array.length - 1 ? true : false}
                message={message.prompt}
                doWrite={message.doWrite}
              />
            );
          })}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col p-4 gap-3">
          <InputLabel name="Name / Username" />
          <input
            ref={usernameRef}
            type="text"
            name="name"
            required
            minLength={3}
            maxLength={30}
            onFocus={() => {
              if (usernameRef.current?.value.length! < 3) {
                addPrompt("enter_username");
              }
            }}
            onBlur={() => {
              const value = usernameRef.current?.value;
              if (value && value.length > 2) {
                addPrompt("set name: " + value, false);
              }
            }}
            onChange={handleFormChange}
          />
          <InputLabel name="email" />
          <input
            ref={emailRef}
            type="text"
            name="email"
            maxLength={60}
            onFocus={() => {
              addPrompt("enter_email");
            }}
            onBlur={() => {
              const value = emailRef.current?.value;
              if (value && value.length > 2) {
                addPrompt("set email: " + value, false);
              }
            }}
          />
          <InputLabel name="password" />
          <input
            ref={passwordRef}
            type="password"
            name="password"
            required
            minLength={6}
            maxLength={60}
            onFocus={async () => {
              addPrompt("enter_password");
            }}
            onChange={handleFormChange}
          />
          <InputLabel name="confirm password" />
          <input
            ref={confirmPassRef}
            type="password"
            name="confirm_password"
            required
            minLength={6}
            maxLength={60}
            onFocus={() => {
              addPrompt("confirm_password");
            }}
            onChange={handleFormChange}
          />
          <button
            ref={submitRef}
            className="mt-4"
            disabled={submitDisabled}
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </PageContainer>
  );
};

export default Register;

const PromptText = ({
  message,
  active,
  doWrite,
}: {
  message: string;
  doWrite?: boolean;
  active?: boolean;
}) => {
  const [promptText, setPromptText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const writeLetters = async (message: string) => {
    let msg = "";
    const write = async function () {
      for (let i = 0; i < message.length; i++) {
        msg += message[i];
        await delay(40);
        setPromptText(msg);
      }
    };
    await write();
    await delay(250);
  };
  useEffect(() => {
    if (doWrite === true) {
      writeLetters(message);
    } else {
      setPromptText(message);
    }
    setShowCursor(!showCursor);
  }, []);

  return (
    <p className={active ? "active-msg" : "old-msg"}>
      {active ? <span className="active-symbol">↪</span> : "~/"}
      {promptText}
      {showCursor && <span className="cursor">|</span>}
    </p>
  );
};

function setClassOk(ref: React.RefObject<HTMLInputElement>) {
  ref.current?.classList.add("field-ok");
}

function removeClassOk(ref: React.RefObject<HTMLInputElement>) {
  ref.current?.classList.remove("field-ok");
}

function setClassError(ref: React.RefObject<HTMLInputElement>) {
  ref.current?.classList.add("field-error");
}

function removeClassError(ref: React.RefObject<HTMLInputElement>) {
  ref.current?.classList.remove("field-error");
}
