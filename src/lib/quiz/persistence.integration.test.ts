import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { HIGH_SCORES_KEY, updateHighScore } from "./persistence";

describe("High scores persistence (integration)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists a high score across hook remounts", () => {
    // First mount: user scores 75%
    const { result: first } = renderHook(() =>
      useLocalStorage<Record<string, number>>(HIGH_SCORES_KEY, {}),
    );

    act(() => {
      first.current[1]((prev) => updateHighScore(prev, "JS Quirks", 75));
    });

    expect(first.current[0]).toEqual({ "JS Quirks": 75 });

    // Unmount and remount (simulates page reload)
    const { result: second } = renderHook(() =>
      useLocalStorage<Record<string, number>>(HIGH_SCORES_KEY, {}),
    );

    expect(second.current[0]).toEqual({ "JS Quirks": 75 });
  });

  it("keeps the highest score after multiple attempts", () => {
    const { result } = renderHook(() =>
      useLocalStorage<Record<string, number>>(HIGH_SCORES_KEY, {}),
    );

    act(() => {
      result.current[1]((prev) => updateHighScore(prev, "mixed", 60));
    });
    expect(result.current[0]).toEqual({ mixed: 60 });

    act(() => {
      result.current[1]((prev) => updateHighScore(prev, "mixed", 80));
    });
    expect(result.current[0]).toEqual({ mixed: 80 });

    act(() => {
      result.current[1]((prev) => updateHighScore(prev, "mixed", 70));
    });
    // Still 80, not 70
    expect(result.current[0]).toEqual({ mixed: 80 });
  });

  it("tracks scores independently per category", () => {
    const { result } = renderHook(() =>
      useLocalStorage<Record<string, number>>(HIGH_SCORES_KEY, {}),
    );

    act(() => {
      result.current[1]((prev) => updateHighScore(prev, "JS Quirks", 80));
    });
    act(() => {
      result.current[1]((prev) => updateHighScore(prev, "Networking", 60));
    });
    act(() => {
      result.current[1]((prev) => updateHighScore(prev, undefined, 90));
    });

    expect(result.current[0]).toEqual({
      "JS Quirks": 80,
      Networking: 60,
      mixed: 90,
    });
  });

  it("reads previously stored scores on first mount", () => {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify({ "JS Quirks": 85, mixed: 95 }));

    const { result } = renderHook(() =>
      useLocalStorage<Record<string, number>>(HIGH_SCORES_KEY, {}),
    );

    expect(result.current[0]).toEqual({ "JS Quirks": 85, mixed: 95 });
  });

  it("returns empty object when no scores exist", () => {
    const { result } = renderHook(() =>
      useLocalStorage<Record<string, number>>(HIGH_SCORES_KEY, {}),
    );

    expect(result.current[0]).toEqual({});
  });

  it("does not lose other categories when updating one", () => {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify({ "JS Quirks": 80 }));

    const { result } = renderHook(() =>
      useLocalStorage<Record<string, number>>(HIGH_SCORES_KEY, {}),
    );

    act(() => {
      result.current[1]((prev) => updateHighScore(prev, "Networking", 70));
    });

    expect(result.current[0]).toEqual({ "JS Quirks": 80, Networking: 70 });
  });
});
