import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./use-local-storage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns the initial value when storage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("persists the value to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(localStorage.getItem("test-key")).toBe(JSON.stringify("updated"));
  });

  it("reads the existing value from localStorage on mount", () => {
    localStorage.setItem("test-key", JSON.stringify("stored"));

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    expect(result.current[0]).toBe("stored");
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("removes the value from localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated");
    });
    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe("initial");
    expect(localStorage.getItem("test-key")).toBeNull();
  });

  it("handles malformed JSON gracefully", () => {
    localStorage.setItem("test-key", "not-json");

    const { result } = renderHook(() => useLocalStorage("test-key", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });

  it("persists objects correctly", () => {
    const { result } = renderHook(() => useLocalStorage<Record<string, number>>("scores", {}));

    act(() => {
      result.current[1]({ js: 80, networking: 60 });
    });

    expect(JSON.parse(localStorage.getItem("scores")!)).toEqual({ js: 80, networking: 60 });
  });
});
