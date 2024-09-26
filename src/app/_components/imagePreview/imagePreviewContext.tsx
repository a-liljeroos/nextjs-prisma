"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
// components
import Image from "next/image";

interface ImageViewContextProps {
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}

const ImageViewContext = createContext<ImageViewContextProps>(
  {} as ImageViewContextProps
);

export const useImageViewContext = () => {
  const context = useContext(ImageViewContext);
  if (!context) {
    throw new Error(
      "useImageViewContext must be used within a ImageViewContextProvider"
    );
  }
  return context;
};

type ImageViewContextProviderProps = {
  children: ReactNode;
};

export const ImageViewContextProvider = ({
  children,
}: ImageViewContextProviderProps) => {
  const [image, setImage] = useState<string>("");

  return (
    <ImageViewContext.Provider
      value={{
        image,
        setImage,
      }}
    >
      {children}
    </ImageViewContext.Provider>
  );
};

interface ImageViewProps {
  containerRef: React.RefObject<HTMLElement>;
  className?: string;
  height?: number;
  quality?: number;
  style?: React.CSSProperties;
  width?: number;
}

export const ImageView = ({
  containerRef,
  className,
  height = 100,
  quality = 75,
  style,
  width = 100,
}: ImageViewProps) => {
  const { image, setImage } = useImageViewContext();
  const [top, setTop] = useState<number>(20);

  useEffect(() => {
    const mainRef = containerRef?.current;
    const scrollPosition = mainRef?.scrollTop;

    if (scrollPosition) {
      if (scrollPosition === 0) {
        setTop(20);
      } else setTop(scrollPosition + 20);
    }
  }, [image]);

  if (!image) return null;
  return (
    <div
      className="absolute  w-full flex justify-center items-center"
      style={{ top: top }}
    >
      <Image
        onClick={() => setImage("")}
        width={width}
        height={height}
        src={image}
        alt="image"
        style={style}
        quality={quality}
        className={className}
      />
    </div>
  );
};
