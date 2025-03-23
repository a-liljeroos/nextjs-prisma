"use client";
import { useState, useEffect, useRef, RefObject } from "react";
import toast from "react-hot-toast";

// =======================================

/**
 * url path for the default avatar in public folder
 */

export const defaultAvatar = "/default-avatar.png";

// =======================================

/**
 * Formats a given date into a human-readable string.
 *
 * - If the date is today, it returns "today".
 * - If the date is yesterday, it returns "yesterday".
 * - Otherwise, it returns the date formatted as "DD/MM/YYYY" (en-GB locale).
 *
 * @param date - The input date to format.
 * @returns A string representing the formatted date.
 */

export function dateOnly(date: Date) {
  const now = new Date();

  // Create date-only versions for comparisons.
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const inputDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (inputDate.getTime() === today.getTime()) {
    return "today"; // Do not display a date label for today.
  } else if (inputDate.getTime() === yesterday.getTime()) {
    return "yesterday";
  } else {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}

/**
 * Formats a given date into a human-readable string that includes the time and a date label.
 *
 * - If the date is today, it returns only the time in "HH:mm" format (24-hour clock).
 * - If the date is yesterday, it appends "yesterday" to the time.
 * - For other dates, it appends the date in "DD/MM/YYYY" format.
 *
 * @param date - The input date to format.
 * @returns A formatted string combining the time and a date label.
 */

export function timeAndDate(date: Date) {
  const now = new Date();

  // Reset times for accurate date-only comparisons
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const inputDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  // If the date is today, return only the time
  if (inputDate.getTime() === today.getTime()) {
    return timeString;
  }

  let dateLabel;
  if (inputDate.getTime() === yesterday.getTime()) {
    dateLabel = "yesterday";
  } else {
    dateLabel = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return `${timeString} ⎯ ${dateLabel}`;
}

// =======================================

export function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  function handleResize() {
    setWindowDimensions(getWindowDimensions());
  }

  useEffect(() => {
    if (hasWindow) {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}

// =======================================

// ref https://gist.github.com/PhilipWee/3b0efbe1ec72300b61c17c2d2a0d593f#file-debounce-hook-ts

type Timer = ReturnType<typeof setTimeout>;
type SomeFunction = (...args: any) => void;
/**
 *
 * @param func The original, non debounced function (You can pass any number of args to it)
 * @param delay The delay (in ms) for the function to return
 * @returns The debounced function, which will run only if the debounced function has not been called in the last (delay) ms
 */

export function useDebounce<Func extends SomeFunction>(
  func: Func,
  delay = 1000
) {
  const timer = useRef<Timer>();

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedFunction = ((...args) => {
    const newTimer = setTimeout(() => {
      func(...args);
    }, delay);
    clearTimeout(timer.current);
    timer.current = newTimer;
  }) as Func;

  return debouncedFunction;
}

// =======================================

/**
 *
 * @returns A boolean that is true if the component is mounted. Use this to prevent side effects from running before the component is mounted. For example when using window objects.
 */

export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
}

// =======================================

/**
 *
 * Observes an element and returns a boolean that is true if the element is in view.
 */

export const useIntersectionObserver = (): [
  boolean,
  RefObject<HTMLDivElement>
] => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return [isVisible, elementRef];
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isYesterday = (date: Date): boolean => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

// =======================================

/**
 *
 * @returns A function that copies a string to the clipboard. Returns a string that is either "Copied to clipboard!" or "Failed to copy!". Use this to copy text to the clipboard.
 */

export const useClipboard = (): [(text: string) => Promise<void>] => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy!");
    }
  };

  return [copyToClipboard];
};

// =======================================

/**
 *
 * @param key The key to store the value in local storage
 * @param initialValue The initial value to store in local storage
 * @returns A tuple containing the stored value and a function to update the stored value. Use this to store values in local storage.
 */

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get value from local storage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        if (typeof initialValue === "boolean") {
          return item === "true";
        }
        return JSON.parse(item);
      } else {
        return initialValue;
      }
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Update local storage whenever the state changes
  useEffect(() => {
    try {
      const valueToStore =
        typeof storedValue === "boolean"
          ? String(storedValue)
          : JSON.stringify(storedValue);
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  // Return the state and a function to update it
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// =======================================

/**
 * Generates an array of delay values for an ease-out effect.
 *
 * @param items - The input array (of any type).
 * @param steepness - Optional parameter to control the "tightness" of the ease-out effect.
 *                    Default is 1, minimum is 0, and maximum is 2.
 * @returns An array of delay values corresponding to the input array length.
 */

export function calculateEaseOutDelays(
  items: any[],
  steepness: number = 1
): number[] {
  // Clamp the steepness value between 0 and 2
  const clampedSteepness = Math.max(0, Math.min(steepness, 2));

  const length = items.length;
  if (length === 0) return []; // Return an empty array if the input array is empty.

  // Generate delay values based on an ease-out effect
  return items.map((_, index) => {
    // Normalize the index to a range of 0 to 1
    const t = index / (length - 1); // `t` is the normalized time for ease-out effect
    // Apply an ease-out formula: delay = 1 - (1 - t)^steepness
    return clampedSteepness === 0 ? t : 1 - Math.pow(1 - t, clampedSteepness);
  });
}
