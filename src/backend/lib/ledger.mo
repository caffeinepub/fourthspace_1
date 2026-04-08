/// lib/ledger.mo
/// ICP Ledger and ICRC-1 actor declarations + account ID derivation helpers.
/// All inter-canister ledger calls are defined here.

import Blob "mo:core/Blob";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Text "mo:core/Text";
import Char "mo:core/Char";
import Principal "mo:core/Principal";
import Array "mo:core/Array";

module {

  // ─── Ledger Actor Interfaces ─────────────────────────────────────────────────

  /// ICP Ledger canister (mainnet)
  public let icpLedger : actor {
    account_balance : query ({ account : Blob }) -> async { e8s : Nat64 };
    transfer : ({
      to : Blob;
      amount : { e8s : Nat64 };
      fee : { e8s : Nat64 };
      memo : Nat64;
      from_subaccount : ?Blob;
      created_at_time : ?{ timestamp_nanos : Nat64 };
    }) -> async { #Ok : Nat64; #Err : {
      #BadFee : { expected_fee : { e8s : Nat64 } };
      #InsufficientFunds : { balance : { e8s : Nat64 } };
      #TxTooOld : { allowed_window_nanos : Nat64 };
      #TxCreatedInFuture;
      #TxDuplicate : { duplicate_of : Nat64 };
    } };
  } = actor "ryjl3-tyaaa-aaaaa-aaaba-cai";

  /// ckBTC Ledger canister (mainnet, ICRC-1)
  public let ckBTCLedger : actor {
    icrc1_balance_of : query ({ owner : Principal; subaccount : ?Blob }) -> async Nat;
    icrc1_transfer : ({
      to : { owner : Principal; subaccount : ?Blob };
      amount : Nat;
      fee : ?Nat;
      memo : ?Blob;
      from_subaccount : ?Blob;
      created_at_time : ?Nat64;
    }) -> async { #Ok : Nat; #Err : {
      #BadFee : { expected_fee : Nat };
      #BadBurn : { min_burn_amount : Nat };
      #InsufficientFunds : { balance : Nat };
      #TooOld;
      #CreatedInFuture : { ledger_time : Nat64 };
      #Duplicate : { duplicate_of : Nat };
      #TemporarilyUnavailable;
      #GenericError : { error_code : Nat; message : Text };
    } };
  } = actor "mxzaz-hqaaa-aaaar-qaada-cai";

  // ─── ICRC-2 Actor Interfaces ─────────────────────────────────────────────────

  /// Generic ICRC-2 ledger interface for approve/transfer_from.
  /// Used for trustless escrow deposits: caller approves canister, then canister pulls funds.
  type Icrc2ApproveArgs = {
    from_subaccount : ?Blob;
    spender : { owner : Principal; subaccount : ?Blob };
    amount : Nat;
    expected_allowance : ?Nat;
    expires_at : ?Nat64;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };

  type Icrc2TransferFromArgs = {
    spender_subaccount : ?Blob;
    from : { owner : Principal; subaccount : ?Blob };
    to : { owner : Principal; subaccount : ?Blob };
    amount : Nat;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };

  type Icrc2TransferFromResult = {
    #Ok : Nat;
    #Err : {
      #BadFee : { expected_fee : Nat };
      #BadBurn : { min_burn_amount : Nat };
      #InsufficientFunds : { balance : Nat };
      #InsufficientAllowance : { allowance : Nat };
      #TooOld;
      #CreatedInFuture : { ledger_time : Nat64 };
      #Duplicate : { duplicate_of : Nat };
      #TemporarilyUnavailable;
      #GenericError : { error_code : Nat; message : Text };
    };
  };

  /// Call icrc2_transfer_from on any ICRC-2 ledger canister.
  /// Used for escrow deposits: the payer approves via icrc2_approve (frontend/wallet),
  /// then the canister calls this to pull the approved amount into treasury.
  public func icrc2TransferFrom(
    ledgerCanisterId : Principal,
    fromOwner : Principal,
    fromSubaccount : ?Blob,
    toOwner : Principal,
    toSubaccount : ?Blob,
    amount : Nat,
    memo : ?Blob,
  ) : async Icrc2TransferFromResult {
    let ledger : actor { icrc2_transfer_from : (Icrc2TransferFromArgs) -> async Icrc2TransferFromResult } =
      actor(ledgerCanisterId.toText());
    await ledger.icrc2_transfer_from({
      spender_subaccount = null;
      from = { owner = fromOwner; subaccount = fromSubaccount };
      to = { owner = toOwner; subaccount = toSubaccount };
      amount;
      fee = null;
      memo;
      created_at_time = null;
    })
  };

  /// Error description for ICRC-2 transfer_from error variants
  public func icrc2TransferFromErrorText(err : {
    #BadFee : { expected_fee : Nat };
    #BadBurn : { min_burn_amount : Nat };
    #InsufficientFunds : { balance : Nat };
    #InsufficientAllowance : { allowance : Nat };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  }) : Text {
    switch (err) {
      case (#BadFee { expected_fee }) "BadFee: expected fee " # expected_fee.toText();
      case (#BadBurn { min_burn_amount }) "BadBurn: min burn " # min_burn_amount.toText();
      case (#InsufficientFunds { balance }) "InsufficientFunds: balance is " # balance.toText();
      case (#InsufficientAllowance { allowance }) "InsufficientAllowance: allowance is " # allowance.toText();
      case (#TooOld) "TooOld";
      case (#CreatedInFuture _) "CreatedInFuture";
      case (#Duplicate { duplicate_of }) "Duplicate of " # duplicate_of.toText();
      case (#TemporarilyUnavailable) "TemporarilyUnavailable";
      case (#GenericError { message }) "GenericError: " # message;
    }
  };

  /// ICP ledger canister ID (mainnet)
  public func icpLedgerCanisterId() : Principal { Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai") };

  /// ckBTC ledger canister ID (mainnet)
  public func ckBTCLedgerCanisterId() : Principal { Principal.fromText("mxzaz-hqaaa-aaaar-qaada-cai") };

  // ─── ICP Account ID Derivation ───────────────────────────────────────────────

  /// Derive the canonical ICP account ID from a principal and optional subaccount.
  /// Uses Principal.toLedgerAccount which implements the standard ICP derivation:
  /// SHA-224(0x0A | "account-id" | principal_bytes | subaccount_bytes) with CRC32 prefix.
  /// Returns 32-byte Blob.
  public func deriveAccountId(principal : Principal, subaccount : ?Blob) : Blob {
    principal.toLedgerAccount(subaccount)
  };

  /// Convert a 32-byte account ID Blob to its 64-char lowercase hex string
  public func accountIdToHex(accountId : Blob) : Text {
    let bytes = accountId.toArray();
    var result = "";
    for (b in bytes.vals()) {
      let hi = b.toNat() / 16;
      let lo = b.toNat() % 16;
      result := result # Text.fromChar(hexNibbleToChar(hi)) # Text.fromChar(hexNibbleToChar(lo));
    };
    result
  };

  private func hexNibbleToChar(n : Nat) : Char {
    if (n < 10) Char.fromNat32(Nat32.fromNat(n) + 48)  // '0'..'9'
    else Char.fromNat32(Nat32.fromNat(n - 10) + 97)    // 'a'..'f'
  };

  /// Parse a 64-char hex string to a 32-byte Blob for ledger transfer calls.
  /// Returns null if the string is not valid 64-char hex.
  public func hexToAccountBlob(hex : Text) : ?Blob {
    let chars = hex.toArray();
    if (chars.size() != 64) return null;
    // Validate all nibbles first
    var valid = true;
    var j = 0;
    while (j < 64 and valid) {
      switch (charToHexNibble(chars[j])) {
        case null { valid := false };
        case _ {};
      };
      j += 1;
    };
    if (not valid) return null;
    // Build immutable array directly via tabulate
    let byteArray = Array.tabulate(32, func(idx) {
      let h = switch (charToHexNibble(chars[idx * 2])) { case (?v) v; case null 0 };
      let l = switch (charToHexNibble(chars[idx * 2 + 1])) { case (?v) v; case null 0 };
      Nat8.fromNat(h * 16 + l)
    });
    ?Blob.fromArray(byteArray)
  };

  private func charToHexNibble(c : Char) : ?Nat {
    let n = c.toNat32();
    if (n >= 48 and n <= 57) ?(n - 48).toNat()       // '0'..'9'
    else if (n >= 97 and n <= 102) ?(n - 87).toNat()  // 'a'..'f'
    else if (n >= 65 and n <= 70) ?(n - 55).toNat()   // 'A'..'F'
    else null
  };

  /// Format an ICRC-1 account as "principal" or "principal.subaccounthex" if non-default
  public func formatIcrc1Account(principal : Principal, subaccount : ?[Nat8]) : Text {
    let pText = principal.toText();
    switch (subaccount) {
      case null pText;
      case (?sub) {
        let allZero = sub.all(func b = b == 0);
        if (allZero) pText
        else pText # "." # accountIdToHex(Blob.fromArray(sub))
      };
    }
  };

  /// Error description for ICP transfer error variants
  public func icpTransferErrorText(err : {
    #BadFee : { expected_fee : { e8s : Nat64 } };
    #InsufficientFunds : { balance : { e8s : Nat64 } };
    #TxTooOld : { allowed_window_nanos : Nat64 };
    #TxCreatedInFuture;
    #TxDuplicate : { duplicate_of : Nat64 };
  }) : Text {
    switch (err) {
      case (#BadFee { expected_fee }) "BadFee: expected " # expected_fee.e8s.toText() # " e8s";
      case (#InsufficientFunds { balance }) "InsufficientFunds: balance is " # balance.e8s.toText() # " e8s";
      case (#TxTooOld _) "TxTooOld: transaction window exceeded";
      case (#TxCreatedInFuture) "TxCreatedInFuture";
      case (#TxDuplicate { duplicate_of }) "TxDuplicate of block " # duplicate_of.toText();
    }
  };

  /// Error description for ICRC-1 transfer error variants
  public func icrc1TransferErrorText(err : {
    #BadFee : { expected_fee : Nat };
    #BadBurn : { min_burn_amount : Nat };
    #InsufficientFunds : { balance : Nat };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  }) : Text {
    switch (err) {
      case (#BadFee { expected_fee }) "BadFee: expected fee " # expected_fee.toText();
      case (#BadBurn { min_burn_amount }) "BadBurn: min burn " # min_burn_amount.toText();
      case (#InsufficientFunds { balance }) "InsufficientFunds: balance is " # balance.toText();
      case (#TooOld) "TooOld";
      case (#CreatedInFuture _) "CreatedInFuture";
      case (#Duplicate { duplicate_of }) "Duplicate of " # duplicate_of.toText();
      case (#TemporarilyUnavailable) "TemporarilyUnavailable";
      case (#GenericError { message }) "GenericError: " # message;
    }
  };
};
