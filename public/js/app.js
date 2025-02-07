document.addEventListener("DOMContentLoaded", async () => {
    const flashLoanButton = document.getElementById("flashLoanButton");
    const umbrellaButton = document.getElementById("umbrellaButton");
    const modal = document.getElementById("aboutModal");

    let userWallet = null;
    let isWhitelisted = false;

    async function checkWalletWhitelist() {
        if (!window.ethereum) {
            alert("MetaMask is required to use this site.");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        userWallet = await signer.getAddress();

        console.log("Connected wallet:", userWallet);

        // Check if wallet is whitelisted
        const response = await fetch("/check-whitelist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallet: userWallet }),
        });

        const data = await response.json();
        isWhitelisted = data.whitelisted;

        // Update UI based on whitelist status
        if (isWhitelisted) {
            umbrellaButton.style.borderColor = "#00ffcc";
            umbrellaButton.style.boxShadow = "0 0 20px #00ffcc";
            modal.innerHTML = "<h2>Welcome, Whitelisted Member!</h2><p>You have full access.</p>";
            flashLoanButton.style.display = "block"; // Show flash loan button
        } else {
            umbrellaButton.style.borderColor = "#ff00ff";
            umbrellaButton.style.boxShadow = "0 0 20px #ff00ff";
            modal.innerHTML = `
                <h2>Request Access</h2>
                <p>Enter your name and wallet address to request access.</p>
                <input type="text" id="userName" placeholder="Your Name">
                <button id="requestAccessButton">Request Access</button>
            `;

            // Handle request access
            document.getElementById("requestAccessButton").addEventListener("click", async () => {
                const userName = document.getElementById("userName").value;
                if (!userName) {
                    alert("Please enter your name.");
                    return;
                }

                await fetch("/request-access", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ wallet: userWallet, name: userName }),
                });

                alert("Request sent. You will receive an email if approved.");
            });

            flashLoanButton.style.display = "none"; // Hide flash loan button if not whitelisted
        }
    }

    flashLoanButton.addEventListener("click", async () => {
        console.log("Flash Loan Button Clicked!");
        await executeFlashLoan();
    });

    umbrellaButton.addEventListener("click", () => {
        modal.style.display = "block";
    });

    document.getElementById("closeModal").addEventListener("click", () => {
        modal.style.display = "none";
    });

    await checkWalletWhitelist();
});