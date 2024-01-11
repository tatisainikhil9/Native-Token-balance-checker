import React, { useEffect, useRef, useState, useCallback } from 'react';
import { formatEther, JsonRpcProvider } from 'ethers';
import './NetworkDataDisplay.css';

const NetworkDataRow = ({ rpcUrl, networkName, address, refreshInterval }) => {
    const [balance, setBalance] = useState(null);
    const [percentageChange, setPercentageChange] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    const isComponentMounted = useRef(false);
    const provider = useRef(new JsonRpcProvider(rpcUrl));

    const fetchNetworkData = useCallback(async () => {
        try {
            const currentBalance = await getCurrentBalance();
            const pastBalance = await getHistoricalBalance();
            const changePercentage = calculateChange(currentBalance, pastBalance);

            setBalance(currentBalance);
            setPercentageChange(changePercentage.toFixed(2));

            if (changePercentage < -10) {
                setAlertMessage(`Your ${networkName} balance decreased by more than 10% in the last 12 hours!`);
            } else {
                setAlertMessage('');
            }
        } catch (error) {
            console.error(`Error fetching ${networkName} balance:`, error);
        }
    }, [address, networkName]);

    useEffect(() => {
        if (!isComponentMounted.current) {
            fetchNetworkData();
            isComponentMounted.current = true;
        }

        const intervalId = setInterval(fetchNetworkData, refreshInterval);
        return () => clearInterval(intervalId);
    }, [fetchNetworkData, refreshInterval]);

    const getCurrentBalance = async () => {
        const balance = await provider.current.getBalance(address);
        return Number(formatEther(balance));
    };

    const getHistoricalBalance = async () => {
        const pastBlock = await getPastBlock();
        const pastBalance = await provider.current.getBalance(address, pastBlock);
        return Number(formatEther(pastBalance));
    };

    const getPastBlock = async () => {
        const currentBlock = await provider.current.getBlockNumber();
        const averageBlockTime = await getAverageBlockTime(currentBlock);
        return currentBlock - Math.floor((12 * 3600) / averageBlockTime);
    };

    const getAverageBlockTime = async (currentBlock) => {
        const startBlock = currentBlock - 100;
        const [current, start] = await Promise.all([
            provider.current.getBlock(currentBlock),
            provider.current.getBlock(startBlock),
        ]);
        return (current.timestamp - start.timestamp) / 100.0;
    };

    const calculateChange = (current, past) => ((current - past) / past) * 100;

    return (
        <div className="network-data-row">
            <NetworkName name={networkName} />
            <div className="data-details">
                <div className="balance-change">
                    <Balance amount={balance} />
                    <ChangePercent change={percentageChange} />
                </div>
            </div>
            {alertMessage && <Alert message={alertMessage} />}
        </div>
    );
};

const NetworkName = ({ name }) => <span className="network-name">{name}</span>;
const Balance = ({ amount }) => <p className="balance-info">{amount} ETH</p>;
const ChangePercent = ({ change }) => <p className={`change-percent ${change >= 0 ? 'positive' : 'negative'}`}>{change}%</p>;
const Alert = ({ message }) => <div className="alert-message">{message}</div>;

export default NetworkDataRow;
