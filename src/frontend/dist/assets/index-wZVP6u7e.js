import { j as jsxRuntimeExports, z as cn, aY as Principal, b9 as JSON_KEY_PRINCIPAL, ba as base32Decode, bb as base32Encode, bc as getCrc32 } from "./index-1XRv9GHr.js";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JSON_KEY_PRINCIPAL,
  Principal,
  base32Decode,
  base32Encode,
  getCrc32
}, Symbol.toStringTag, { value: "Module" }));
export {
  Skeleton as S,
  index as i
};
