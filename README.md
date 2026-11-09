# ☂ UmbrellaAcademy ☂

## If you don't know, now you know.

Umbrella Academy is an advanced training and practice space for the Umbrella
Group and Code Camp graduates familiar with BigNuten, DBusk, DJuke and DVert,
including future homestead work. It is not a second beginner academy. This
source is not evidence of deployed membership or an active training service.

## Header and historical prototype

Serve `public/` over HTTP. The landing page uses DecentHead
`00691c4fe93fd280f5aec780bdc4fac651bfcdb1`'s adoption manifest, including
`WalletSession`, `IPFSControls`, `AboutModal`, local assets, LICENSE and NOTICE.
`switchChain` and `WalletConnect` are adapted for `chain: null`, so an explicit
wallet connection observes the current chain without switching it. Provider
selection is unverified; backup, restore, public pinning and rewards are
unavailable. No student data is uploaded and UCAN authorization is not
implemented. Disconnect does not revoke the extension's site permission.

The historical `public/js/app.js` and `flashLoan.js` are retained as source but
are not loaded by the landing page: the former depends on missing elements and
attempted automatic wallet access, and the latter has a placeholder contract
address and empty ABI. No membership or flash-loan operation is claimed or
newly enabled; server routes are unchanged.

The explicit **Verify provider connection (no upload)** action uses the shared
`IPFSSession.verifyConnection()` flow from the pinned DecentHead adoption.
Personal Pinata credentials stay in tab memory and go only to the fixed HTTPS
authentication endpoint. Local Kubo verification reads its loopback version
endpoint without credentials. Provider readiness is not backup, retention or
rewards; host storage capabilities remain unavailable.

Receiving Chromium checks at 375px exercise wallet rejection, connection,
account/network changes, disconnect, provider selection, unavailable storage,
About and Escape with mocked wallets and external requests blocked. The
self-contained provider test covers mocked Pinata authentication failure,
network failure, success and Kubo version responses without uploads. These are
not live wallet, storage, contract or deployment checks.

## License

Code: [Apache-2.0](LICENSE) · Art and docs: [CC BY 4.0](LICENSES/CC-BY-4.0.txt).
Keep the [NOTICE](NOTICE) with redistributed work.
