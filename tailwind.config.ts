import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "landing-letter": { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(10px)" } },
        "landing-dod": { "0%, 100%": { transform: "translateY(10px)" }, "50%": { transform: "translateY(0)" } },

        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeOut: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: { opacity: "0", transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        toastShow: {
          from: { transform: "translate(-50%,100%)" },
          to: { transform: "translate(-50%,0)" },
        },
        toastDown: {
          from: { transform: "translate(-50%,0)" },
          to: { transform: "translate(-50%,100%)" },
        },
        slideDown: {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        scaleBounce: {
          "0%": { transform: "scale(0)" },
          "70%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1.0)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 500ms ease-in",
        fadeIn: " fadeIn 150ms ease-in",
        fadeOut: "fadeOut 150ms ease-in",
        "fadeIn-500": " fadeIn 500ms ease-in-out",
        "fadeOut-500": "fadeOut 500ms ease-in-out",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        toastShow: "toastShow 300ms ease-in",
        toastDown: "toastDown 300ms ease-out",
        slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        scaleBounce: "scaleBounce 1000ms ease-out",
        "landing-letter": "landing-letter 2.2s ease-in-out infinite",
        "landing-dod": "landing-dod 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
