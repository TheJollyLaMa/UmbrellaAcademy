require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Whitelist of approved wallet addresses
const WHITELISTED_WALLETS = [
    "0x1234567890abcdef1234567890abcdef12345678", // Example wallet
    "0xabcdefabcdefabcdefabcdefabcdefabcdef",     // Add real wallets here
];

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// API Route: Check if a wallet is whitelisted
app.post("/check-whitelist", (req, res) => {
    const { wallet } = req.body;
    if (!wallet) {
        return res.status(400).json({ error: "Wallet address is required." });
    }
    const isWhitelisted = WHITELISTED_WALLETS.includes(wallet.toLowerCase());
    res.json({ whitelisted: isWhitelisted });
});

// API Route: Handle whitelist access request email
app.post("/request-access", async (req, res) => {
    const { wallet, name } = req.body;
    if (!wallet || !name) {
        return res.status(400).json({ error: "Name and wallet address are required." });
    }

    const emailContent = `
        New Whitelist Access Request:
        Name: ${name}
        Wallet Address: ${wallet}
    `;

    console.log("Sending request to whitelist:", emailContent);
    res.json({ message: "Access request submitted. You will receive an email if approved." });
});

// API Route: Execute Flash Loan (Whitelisted Users Only)
app.post("/flashloan", async (req, res) => {
    const { wallet } = req.body;
    if (!wallet || !WHITELISTED_WALLETS.includes(wallet.toLowerCase())) {
        return res.status(403).json({ error: "Unauthorized: Wallet not whitelisted." });
    }

    // Simulate flash loan execution
    res.json({ message: "Flash Loan Executed Successfully." });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});