export function getCoins() {
  return fetch("https://api.coinpaprika.com/v1/coins").then((response) =>
    response.json()
  );
}

export function getDetail(id) {
  return fetch(`https://api.coinpaprika.com/v1/coins/${id}`).then((response) =>
    response.json()
  );
}

