"use client";
// components
import GlitchText from "@components/glitchText/GlitchText";
import PageContainer from "@components/pageContainer/pageContainer";
import FrontPagePosts from "@/app/_components/post/frontPagePosts";

export default function Home() {
  return (
    <PageContainer>
      <div className="pt-16">
        <div className="glitch-text-container">
          <GlitchText text="  " />
          <GlitchText text="Hi       " />
          <GlitchText text="There... " />
          <GlitchText text="    " />
        </div>
        <div className="mt-4">
          <FrontPagePosts />
        </div>
      </div>
    </PageContainer>
  );
}
