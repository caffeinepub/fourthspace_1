import { e as useActor, l as createActor, aV as Principal, b7 as JSON_KEY_PRINCIPAL, b8 as base32Decode, b9 as base32Encode, ba as getCrc32 } from "./index-DemOGW1B.js";
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
