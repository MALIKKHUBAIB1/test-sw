const btn2 = document.getElementById("btn2");
const productList = document.getElementById("product-list");

async function fetchData() {
  const res = await fetch("https://dummyjson.com/products");
  const resData = await res.json();
  return resData?.products;
}

btn2.addEventListener("click", () => {
  fetchData()
    .then((data) => {
      displayProducts(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

function displayProducts(products) {
  productList.innerHTML = ""; // Clear previous content
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";

    productDiv.innerHTML = `
      <h3>${product.title}</h3>
      <img src="${product.thumbnail}" alt="${product.title}" width="100" />
      <p>Price: $${product.price}</p>
      <p>${product.description}</p>
    `;
    productList.appendChild(productDiv);
  });
}
