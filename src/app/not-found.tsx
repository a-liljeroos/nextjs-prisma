"use client";
import { useRouter } from "next/navigation";
import PageContainer from "@components/pageContainer/pageContainer";
import Button from "@components/buttons/Button";

export default function Custom404() {
  const router = useRouter();

  function handleClick() {
    router.back();
  }

  return (
    <PageContainer>
      <div className="flex gap-4 items-center justify-center min-h-52 ">
        <div className="flex flex-col gap-4 justify-center">
          <h1>404 | Page Not Found</h1>
          <Button classBtn="plain-button" click={handleClick}>
            Go Back
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
