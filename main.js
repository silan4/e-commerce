//! HTML den gelenler
const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const basketBtn = document.querySelector("#basket-btn");
const closeBtn = document.querySelector("#close-btn");
const basketList = document.querySelector("#list");
const totalInfo = document.querySelector("#total");

// html'in yüklenme anını izler:
document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchProducts();

});


/* 
*kategori bilgilerini alma
*1- APIye istek at
*2- gelen veriyi işle
*3-verileri ekrana basıcak fonksiyonu çalıştır
*4-hata oluşursa kullanıcıyı bilgilendir

*/

const baseUrl = 'https://fakestoreapi.com'

function fetchCategories() {
    fetch(` ${baseUrl}/products/categories`)
        .then((response) => response.json())
        .then(renderCategories) //then çalıştırdığı fonksiyon verileri parametre olarak gönderir
    // .catch((err) => alert('Kategorileri alırken bir hata oluştu'));

}


// her bir kategori için ekrana kart oluştur
function renderCategories(categories) {
    categories.forEach((category) => {
        //1- div oluştur
        const categoryDiv = document.createElement('category');
        //2- dive class ekleme 
        categoryDiv.classList.add('category');
        //3-içeriğini belirle
        const randomNum = Math.round(Math.random() * 10);
        categoryDiv.innerHTML =
            `
        <img src="https://picsum.photos/640/640/?r=${randomNum}" />
        <h2>${category}</h2>
        `;
        //4- html'den gönderme
        categoryList.appendChild(categoryDiv);

    })
}

// data değikenini global scope'da tanımladık
// bu sayede bütün fonksiyonlar bu değere erişebilecek
let data;

// ürünler verisini çeken fonksiyon
async function fetchProducts() {
    try {
        //API ye istek at
        const response = await fetch(`${baseUrl}/products`);
        //Gelen cevabı işle
        data = await response.json();
        // ekrana bas
        renderProducts(data);
    } catch (err) {
        //     alert("ürünleri alırken bir hata oluştu")
    }
}

// ürünleri ekrana basar
function renderProducts(products) {

    // her bir ürün için bir ürün kartı oluşturma
    console.log(products)
    const cardsHTML = products.map((product) =>
        `
    <div class="card">
    <div class=" img-wrapper">
         <img src="${product.image}" >
     </div>

             <h4>${product.title}$</h4>
             <h4>${product.category}</h4>
             <div class="info">
             <span>${product.price}$</span>
             <button onclick="addToBasket(${product.id})" >Sepete Ekle</button>
         </div>
     </div>
    `)
        .join('');

    // hazırladığımız HTML i ekrana basma
    productList.innerHTML = cardsHTML;


}

//! sepet işlemleri
let basket = [];
let total = 0;

//modal ı açar
basketBtn.addEventListener('click', () => {
    modal.classList.add('active');
    renderBasket();
    calculateTotal();
});


// dışarıya veya çarpıya tıklanırsa  modal'ı kapatır
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-wrapper') ||
        e.target.id === "close-btn") {
        modal.classList.remove('active');
    }

});

function addToBasket(id) {
    // id'sinden yola çıkarak objenin değerelerini bulma 
    const product = data.find((i) => i.id === id);
    // sepete ürün daha önce eklendiyse bulma
    const found = basket.find((i) => i.id == id);
    if (found) {
        //miktarını arttırır
        found.amount++;
    } else {
        //sepete ürün ekler
        basket.push({ ...product, amount: 1 });
    }

    // bildirim ver
    Toastify({
        text: "Ürün Sepete Eklendi",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },

      }).showToast();

}

//sepete elemanları listeleme
function renderBasket() {

    basketList.innerHTML = basket
        .map(
            (item) =>
                `
        <div class="item">
            <img src="${item.image}" >
            <h3 class="title">${item.title.slice(0, 20 + '...')}</h3>
            <h4 class="price">${item.price}$</h4>
            <p>Miktar: ${item.amount}</p>
            <img onclick=" handleDelete(${item.id})" id="delete-img" src="./imgtcrt/e-trash.png">
        </div>
        
        `
        )
        .join('');

    calculateTotal();
}

// toplam ürün ve fiyatını hesaplar

function calculateTotal() {
    // reduce > diziyi döner ve elemanlarını belirlediğimiz
    //değerlerini toplar
  const total = basket.reduce(
    (sum, item) => sum + item.price * item.amount,
    0
  );

  //toplam miktar hesaplama 
  const amount = basket.reduce((sum , i ) => sum + i.amount , 0);

//   hesapladığımız bilgileri ekrana basma

totalInfo.innerHTML = 

`
<span id="count">${amount}</span>
toplam:
<span id="price"> ${total.toFixed(2)}</span>$

`;
    
}

// elemanı siler 
function handleDelete(deleteId){
    //kaldırılacak ürünü diziden çıkarma
    const newArray = basket.filter((i) => i.id !== deleteId );
    basket = newArray;

    //listeyi günceller
    renderBasket();

    //toplamı günceller
    calculateTotal();
}









