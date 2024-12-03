let clickCount = 0;
let money = 0; // Başlangıç parası sıfır
const items = [];
const equipped = [];
const rarities = ["Kötü", "Normal", "İyi", "Destansı", "Efsanevi", "Aşırı Mistik"];

// Sandık fiyatları
const chestPrices = {
    "Kötü": 1000,
    "Normal": 5000,
    "İyi": 20000,
    "Destansı": 100000,
    "Efsanevi": 500000,
    "Aşırı Mistik": 2000000000000000000000000000
};

const clickButton = document.getElementById("click-button");
const convertButton = document.getElementById("convert-button");
const inventoryButton = document.getElementById("inventory-button");
const shopButton = document.getElementById("shop-button");
const inventory = document.getElementById("inventory");
const inventoryList = document.getElementById("inventory-list");
const shop = document.getElementById("shop");
const shopList = document.getElementById("shop-list");
const closeInventoryButton = document.getElementById("close-inventory");
const closeShopButton = document.getElementById("close-shop");

document.getElementById("money-count").textContent = money;

// Tıklama Butonu
clickButton.addEventListener("click", () => {
    let totalClicks = 1; // Her zaman en az 1 tıklama olacak
    equipped.forEach(item => {
        if (item.clickBonus) {
            totalClicks += item.clickBonus; // Eşyadan gelen tıklama bonusu
        }
    });
    clickCount += totalClicks;
    document.getElementById("click-count").textContent = clickCount;
});

// Tıklamayı Paraya Çevirme
convertButton.addEventListener("click", () => {
    lastNonClickButtonTime = Date.now(); // Anti-auto clicker sıfırlama
    let requiredClicks = 50; // Çevirim için gereken tıklama
    if (clickCount >= requiredClicks) {
        clickCount -= requiredClicks;
        money += 1;
        document.getElementById("click-count").textContent = clickCount;
        document.getElementById("money-count").textContent = money;
    } else {
        alert("50 tıklamaya ihtiyacınız var!");
    }
});

// Envanteri Açma
inventoryButton.addEventListener("click", () => {
    lastNonClickButtonTime = Date.now(); // Anti-auto clicker sıfırlama
    inventoryList.innerHTML = "";
    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} (${item.rarity}, Tıklama Bonus: ${item.clickBonus}, Para Bonus: ${item.moneyBonus || 0})`;
        if (!equipped.includes(item)) {
            const equipButton = document.createElement("button");
            equipButton.textContent = "Tak";
            equipButton.addEventListener("click", () => {
                if (equipped.length < 3) {
                    equipped.push(item);
                    alert(`${item.name} takıldı!`);
                } else {
                    alert("3 eşya takabilirsiniz.");
                }
            });
            li.appendChild(equipButton);
        } else {
            const unequipButton = document.createElement("button");
            unequipButton.textContent = "Çıkar";
            unequipButton.addEventListener("click", () => {
                const index = equipped.indexOf(item);
                equipped.splice(index, 1);
                alert(`${item.name} çıkarıldı!`);
            });
            li.appendChild(unequipButton);
        }
        inventoryList.appendChild(li);
    });
    inventory.classList.remove("hidden");
});

// Mağazayı Açma
shopButton.addEventListener("click", () => {
    lastNonClickButtonTime = Date.now(); // Anti-auto clicker sıfırlama
    shopList.innerHTML = "";
    rarities.forEach(rarity => {
        const price = chestPrices[rarity]; // Fiyat sandık nadirliğine göre
        const li = document.createElement("li");
        li.textContent = `${rarity} Sandık (Fiyat: ${price} para)`;
        const buyButton = document.createElement("button");
        buyButton.textContent = "Satın Al";
        buyButton.addEventListener("click", () => {
            lastNonClickButtonTime = Date.now(); // Anti-auto clicker sıfırlama
            if (money >= price) {
                money -= price;
                const newItem = {
                    name: `${rarity} Eşya ${Math.floor(Math.random() * 50 + 1)}`,
                    rarity: rarity,
                    clickBonus: Math.floor(Math.random() * (rarities.indexOf(rarity) + 1) * 5) + 1, // Tıklama bonusu
                    moneyBonus: rarity === "Aşırı Mistik" ? Math.floor(Math.random() * 10) + 1 : 0 // Para bonusu sadece Aşırı Mistik
                };
                items.push(newItem);
                if (newItem.moneyBonus > 0) {
                    startMoneyBonus(newItem);
                }
                alert(`${newItem.name} sandıktan çıktı! Tıklama Bonus: ${newItem.clickBonus}, Para Bonus: ${newItem.moneyBonus}`);
                document.getElementById("money-count").textContent = money;
            } else {
                alert("Yeterli paranız yok!");
            }
        });
        li.appendChild(buyButton);
        shopList.appendChild(li);
    });
    shop.classList.remove("hidden");
});

// Para Bonusunu İşlet
function startMoneyBonus(item) {
    setInterval(() => {
        if (equipped.includes(item)) {
            money += item.moneyBonus;
            alert(`Para geldi! +${item.moneyBonus}`);
            document.getElementById("money-count").textContent = money;
        }
    }, 60000); // 1 dakikada bir
}

// Pencereleri Kapatma
closeInventoryButton.addEventListener("click", () => {
    lastNonClickButtonTime = Date.now(); // Anti-auto clicker sıfırlama
    inventory.classList.add("hidden");
});

closeShopButton.addEventListener("click", () => {
    lastNonClickButtonTime = Date.now(); // Anti-auto clicker sıfırlama
    shop.classList.add("hidden");
});
