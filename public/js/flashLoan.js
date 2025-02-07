window.executeFlashLoan = async function () {
    if (!window.ethereum) {
        alert("MetaMask is required!");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request wallet connection
    const signer = provider.getSigner();

    // Replace with your deployed contract address and ABI
    const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
    const contractABI = [];  // Make sure to include your contract ABI here

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    try {
        const tx = await contract.executeFlashLoan(
            ethers.utils.parseUnits("1", 18),  // Borrow 1 token
            "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",  // Example token (WETH on Polygon)
            "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",  // Example stablecoin (USDC)
            3000 // Uniswap pool fee (0.3%)
        );

        console.log("Transaction sent:", tx.hash);
        alert(`Flash loan executed! TX Hash: ${tx.hash}`);
    } catch (error) {
        console.error("Flash loan failed:", error);
        alert("Flash loan execution failed. Check console for details.");
    }
};