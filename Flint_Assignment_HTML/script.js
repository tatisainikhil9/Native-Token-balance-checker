const networks = {
    Mantle: 'https://rpc.mantle.xyz',
    Linea: 'https://1rpc.io/linea',
    Kroma: 'https://api.kroma.network'
};

async function getNativeTokenBalance() {
    const address = document.getElementById('address-input').value;
    if (!address) {
        alert('Please enter an address');
        return;
    }

    try {
        const selectedNetwork = document.getElementById('network-select').value;
        const rpcUrl = networks[selectedNetwork];
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

        const currentBalance = await provider.getBalance(address);
        const pastBalance = await getPastBalance(address, provider);

        const currentBalanceInEther = ethers.utils.formatEther(currentBalance);
        const pastBalanceInEther = ethers.utils.formatEther(pastBalance);

        const change = ((currentBalanceInEther - pastBalanceInEther) / pastBalanceInEther) * 100;

        document.getElementById('balance').innerText = `Current Balance: ${currentBalanceInEther} ETH`;
        document.getElementById('change').innerText = `Percentage Change in past 12 hours: ${change.toFixed(2)}%`;
        
        if (change < -10) {
            alert(`Balance has reduced by ${change.toFixed(2)}% in the last 12 hours`);
        }
    } catch (error) {
        console.error("Error fetching balance:", error);
        document.getElementById('balance').innerText = 'Error fetching balance. See console for details.';
    }
}

async function getPastBalance(address, provider) {
    try {
        const hoursAgo = 12;
        const currentBlockNumber = await provider.getBlockNumber();

        const blockPromises = [];
        for (let i = 0; i <= 10; i++) {
            blockPromises.push(provider.getBlock(currentBlockNumber - i));
        }
        const blocks = await Promise.all(blockPromises);

        const timeDifferences = blocks.slice(1).map((block, index) => blocks[index].timestamp - block.timestamp);
        const averageTimePerBlock = timeDifferences.reduce((a, b) => a + b, 0) / timeDifferences.length;

        const hoursAgoInSeconds = hoursAgo * 3600;
        const blocksAgo = Math.floor(hoursAgoInSeconds / averageTimePerBlock);
        const pastBlockNumber = currentBlockNumber - blocksAgo;

        return await provider.getBalance(address, pastBlockNumber);
    } catch (error) {
        console.error('Error getting past balance:', error);
        return ethers.utils.parseEther("0");
    }
}
