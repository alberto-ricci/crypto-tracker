import React, { useState, useEffect } from "react";
import Select from "react-select";
import useFetch from "./useFetch";
import styles from "./app.module.css";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi"; // Import edit icon

function App() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false";
  const { data: cryptos, isLoading } = useFetch(url);
  const [wallet, setWallet] = useState(
    JSON.parse(localStorage.getItem("wallet")) || []
  );
  const [selectedCrypto, setSelectedCrypto] = useState();
  const [holdings, setHoldings] = useState("");

  // Function to handle selected option in select component
  const handleSelect = (selectedOption) => {
    setSelectedCrypto(selectedOption);
  };

  // Function to delete card
  const deleteCard = (id) => {
    setWallet(wallet.filter((crypto) => crypto.id !== id));
  };

  // Store wallet data in localStorage every time it changes
  useEffect(() => {
    localStorage.setItem("wallet", JSON.stringify(wallet));
  }, [wallet]);

  // Function to add crypto to wallet
  const addToWallet = () => {
    if (
      selectedCrypto &&
      !wallet.some((crypto) => crypto.id === selectedCrypto.id)
    ) {
      setWallet([...wallet, { ...selectedCrypto, holdings }]);
    }
  };

  // Function to edit holdings of a crypto in wallet
  const editHoldings = (id, newHoldings) => {
    setWallet(
      wallet.map((crypto) =>
        crypto.id === id ? { ...crypto, holdings: newHoldings } : crypto
      )
    );
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
              <img
                src={crypto.image}
                alt={crypto.name}
                className={styles.logo}
              />
              <h2 className={styles.cryptoName}>{crypto.name}</h2>
              <div className={styles.cryptoInfo}>
                <p
                  className={
                    crypto.price_change_percentage_24h > 0
                      ? styles.positive
                      : styles.negative
                  }
                >
                  {crypto.price_change_percentage_24h.toFixed(2)}% (24h)
                </p>
                <div className={styles.iconContainer}>
                  <AiOutlineDelete
                    className={styles.deleteIcon}
                    onClick={() => deleteCard(crypto.id)}
                  />
                  <FiEdit2
                    className={styles.editIcon}
                    onClick={() =>
                      editHoldings(crypto.id, prompt("Enter new holdings:"))
                    }
                  />
                </div>
              </div>
            </div>
            <div className={styles.holdingsContainer}>
              <h3>Holdings</h3>
              <p>
                {crypto.holdings} {crypto.symbol.toUpperCase()} ={" "}
                {(crypto.holdings * crypto.current_price).toFixed(2)} €
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
