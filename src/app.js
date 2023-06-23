import React, { useState } from 'react';
import Select from 'react-select';
import styles from './app.module.css';
import useFetch from './useFetch';

function App() {
    const url =
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    const { data: cryptos, isLoading } = useFetch(url);
    const [wallet, setWallet] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState();
    const [holdings, setHoldings] = useState('');

    const handleSelect = (selectedOption) => {
        setSelectedCrypto(selectedOption);
    };

    const addToWallet = () => {
        if (selectedCrypto && !wallet.some((crypto) => crypto.id === selectedCrypto.id)) {
            setWallet([...wallet, { ...selectedCrypto, holdings }]);
        }
    };

    const today = new Date().toDateString();

    const options = cryptos
        ? cryptos.map((crypto) => ({
              value: crypto.id,
              label: crypto.name,
              ...crypto,
          }))
        : [];

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className={styles.app}>
            <h1 className={styles.title}>Crypto Tracker</h1>
            <h2 className={styles.date}>{today}</h2>
            <Select
                className={styles.select}
                options={options}
                onChange={handleSelect}
                isSearchable={true}
                formatOptionLabel={(option) => (
                    <div>
                        <img src={option.image} alt={option.name} className={styles.logo} />
                        {option.label}
                    </div>
                )}
            />
            <input
                type="number"
                min="0"
                value={holdings}
                onChange={(event) => setHoldings(event.target.value)}
                className={styles.input}
            />
            <button onClick={addToWallet} className={styles.button}>
                Add to wallet
            </button>
            <div className={styles.wallet}>
                {wallet.map((crypto) => (
                    <div key={crypto.id} className={styles.crypto}>
                        <div className={styles.logoContainer}>
                            <img src={crypto.image} alt={crypto.name} className={styles.logo} />
                            <h2 className={styles.cryptoName}>{crypto.name}</h2>
                            <p
                                className={
                                    crypto.price_change_percentage_24h > 0
                                        ? styles.positive
                                        : styles.negative
                                }
                            >
                                {crypto.price_change_percentage_24h.toFixed(2)}% (24h)
                            </p>
                        </div>
                        <div className={styles.holdingsContainer}>
                            <h3>Your Holdings</h3>
                            <p>
                                {crypto.holdings} * €{crypto.current_price} = €
                                {(crypto.holdings * crypto.current_price).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
