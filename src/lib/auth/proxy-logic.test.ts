import { decideRedirect } from "./proxy-logic";

const ORIGIN = "http://localhost:3000";

describe("decideRedirect", () => {
  describe("when not logged in", () => {
    it("redirects /admin to /sign-in with callbackUrl", () => {
      const result = decideRedirect("/admin", false, ORIGIN);
      expect(result.redirect).toBe("http://localhost:3000/sign-in?callbackUrl=%2Fadmin");
    });

    it("redirects /admin/questions to /sign-in with callbackUrl", () => {
      const result = decideRedirect("/admin/questions", false, ORIGIN);
      expect(result.redirect).toBe(
        "http://localhost:3000/sign-in?callbackUrl=%2Fadmin%2Fquestions",
      );
    });

    it("allows /sign-in", () => {
      const result = decideRedirect("/sign-in", false, ORIGIN);
      expect(result.redirect).toBeNull();
    });

    it("allows public pages", () => {
      expect(decideRedirect("/", false, ORIGIN).redirect).toBeNull();
      expect(decideRedirect("/quiz", false, ORIGIN).redirect).toBeNull();
    });
  });

  describe("when logged in", () => {
    it("redirects /sign-in to /admin", () => {
      const result = decideRedirect("/sign-in", true, ORIGIN);
      expect(result.redirect).toBe("http://localhost:3000/admin");
    });

    it("allows /admin", () => {
      const result = decideRedirect("/admin", true, ORIGIN);
      expect(result.redirect).toBeNull();
    });

    it("allows public pages", () => {
      expect(decideRedirect("/", true, ORIGIN).redirect).toBeNull();
      expect(decideRedirect("/quiz", true, ORIGIN).redirect).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("treats /admin-foo as /admin (prefix match)", () => {
      const result = decideRedirect("/admin-foo", false, ORIGIN);
      // /admin-foo starts with /admin, so it redirects
      expect(result.redirect).toContain("/sign-in");
    });

    it("does not redirect /sign-in-foo", () => {
      const result = decideRedirect("/sign-in-foo", true, ORIGIN);
      // /sign-in-foo is not /sign-in exactly
      expect(result.redirect).toBeNull();
    });
  });
});
