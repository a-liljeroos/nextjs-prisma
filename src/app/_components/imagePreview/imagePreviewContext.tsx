"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useRef,
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
  quality?: number;
  style?: React.CSSProperties;
  width?: number;
  relativeWidth?: number;
  height?: number;
  topPosition?: number;
}

export const ImageView = ({
  containerRef,
  className,
  quality = 75,
  style,
  width = 0,
  relativeWidth = 100,
  height = 100,
  topPosition = 20,
}: ImageViewProps) => {
  const { image, setImage } = useImageViewContext();
  const [top, setTop] = useState<number>(topPosition);
  const [imageWidth, setImageWidth] = useState<number>(width);

  useEffect(() => {
    const mainRef = containerRef?.current;
    const scrollPosition = mainRef?.scrollTop;

    if (scrollPosition && topPosition !== 20) {
      if (scrollPosition !== 0) {
        setTop(scrollPosition + 20);
      }
    }

    if (imageWidth === 0 && mainRef) {
      const widthPercentage = (relativeWidth / 100) * mainRef.clientWidth;
      setImageWidth(widthPercentage);
    }
  }, [image, imageWidth, topPosition, containerRef]);

  if (!image) return null;
  return (
    <div
      className="absolute w-full flex justify-center items-center"
      style={{ top: top }}
    >
      <Image
        onClick={() => setImage("")}
        width={imageWidth}
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
