"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// components
import PageContainer from "@components/pageContainer/pageContainer";

interface ErrorPageProps {
  message: string;
}

const ErrorPage = ({ message }: ErrorPageProps) => {
  const router = useRouter();
  const [count, setCount] = useState(5);
  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 5000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <PageContainer>
      <div className="p-20">
        <h1 className="text-xl font-bold ">{message}</h1>
        <p className="mt-3">
          You will be redirected in {count} seconds or click{" "}
          <Link className="underline text-blue-100" href="/">
            here
          </Link>
          .
        </p>
      </div>
    </PageContainer>
  );
};

export default ErrorPage;
