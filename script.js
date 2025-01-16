// Функция для обновления таблицы товаров
function updateTable() {
    const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Очищаем таблицу перед добавлением новых данных
    const products = JSON.parse(localStorage.getItem('products')) || [];

    products.forEach((product, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td><img src="${product.image}" alt="Фото" width="50"></td>
            <td>${product.model}</td>
            <td>${product.shade}</td>
            <td>${product.quantity}</td>
            <td>${product.wholesalePrice}</td>
            <td>${product.price}</td>
            <td>
                <a href="edit-product.html?id=${index}">Редактировать</a>
                <a href="delete-product.html?id=${index}">Удалить</a>
            </td>
        `;
    });
}

// Вызовем функцию для загрузки данных из localStorage и обновления таблицы
if (document.getElementById('productTable')) {
    updateTable();
}

// Функция для добавления товара
function addProduct(event) {
    event.preventDefault();

    const model = document.getElementById('model').value;
    const shade = document.getElementById('shade').value;
    const quantity = document.getElementById('quantity').value;
    const wholesalePrice = document.getElementById('wholesalePrice').value;
    const price = document.getElementById('price').value;
    const productImage = document.getElementById('productImage').files[0];

    let imageUrl = '';
    if (productImage) {
        const reader = new FileReader();
        reader.onloadend = function () {
            imageUrl = reader.result; // base64 строка
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const newProduct = { model, shade, quantity, wholesalePrice, price, image: imageUrl };
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));
            window.location.href = 'index.html'; // Перенаправляем на главную страницу после добавления
        };
        reader.readAsDataURL(productImage); // Преобразуем изображение в base64
    } else {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const newProduct = { model, shade, quantity, wholesalePrice, price, image: '' };
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        window.location.href = 'index.html'; // Перенаправляем на главную страницу после добавления
    }
}

if (document.getElementById('addProductForm')) {
    document.getElementById('addProductForm').addEventListener('submit', addProduct);
}



function deleteProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Получаем id товара из URL
    const products = JSON.parse(localStorage.getItem('products')) || []; // Загружаем товары из localStorage

    if (productId !== null && productId < products.length) {
        products.splice(productId, 1); // Удаляем товар по индексу
        localStorage.setItem('products', JSON.stringify(products)); // Сохраняем обновленный массив товаров в localStorage
        window.location.href = 'index.html'; // Перенаправляем на главную страницу
    } else {
        alert('Товар не найден!');
    }
}

if (document.getElementById('deleteProductButton')) {
    document.getElementById('deleteProductButton').addEventListener('click', deleteProduct);
}


function editProduct(event) {
    event.preventDefault();

    // Получаем id товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Загружаем список товаров из localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Создаем объект с обновленными данными товара
    const updatedProduct = {
        model: document.getElementById('model').value,
        shade: document.getElementById('shade').value,
        quantity: document.getElementById('quantity').value,
        wholesalePrice: document.getElementById('wholesalePrice').value,
        price: document.getElementById('price').value,
        // Обработка нового изображения, если оно выбрано
        image: document.getElementById('productImage').files[0] ? URL.createObjectURL(document.getElementById('productImage').files[0]) : products[productId].image
    };

    // Обновляем данные товара в массиве
    products[productId] = updatedProduct;

    // Сохраняем обновленный список товаров в localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Показываем сообщение о сохранении
    document.getElementById('savedMessage').style.display = 'block';

    // Показываем кнопку "Назад к товарам"
    document.getElementById('backButton').style.display = 'inline-block';
}

if (document.getElementById('editProductForm')) {
    // Получаем id товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Загружаем список товаров из localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[productId];

    // Заполняем форму данными товара
    document.getElementById('model').value = product.model;
    document.getElementById('shade').value = product.shade;
    document.getElementById('quantity').value = product.quantity;
    document.getElementById('wholesalePrice').value = product.wholesalePrice;
    document.getElementById('price').value = product.price;

    // Отображаем текущее изображение товара, если оно есть
    const imgInput = document.getElementById('productImage');
    const imgPreview = document.createElement('img');
    imgPreview.src = product.image;
    imgPreview.width = 100;
    imgPreview.alt = "Изображение товара";
    imgInput.insertAdjacentElement('afterend', imgPreview);

    // Добавляем обработчик для формы
    document.getElementById('editProductForm').addEventListener('submit', editProduct);
}
