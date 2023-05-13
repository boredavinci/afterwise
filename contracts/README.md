# Inheritance Module - Afterwise

This is a Foundry project containing the `CustomModule.sol` Safe module for managing inheritance of a 1/1 Safe wallet.
It has an `expiration` timestamp that can be extended through `extendValidity`; but once the timestamp is passed,
a `beneficiary` can call `claimSafe` with any `data` to execute directly on the Safe.
However, the frontend will send the data to change ownership to the beneficiary.

