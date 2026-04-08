import { e as useActor, l as createActor, aX as Principal, b9 as JSON_KEY_PRINCIPAL, ba as base32Decode, bb as base32Encode, bc as getCrc32 } from "./index-CzyNqtbv.js";
function useBackend() {
  return useActor(createActor);
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
  index as i,
  useBackend as u
};
