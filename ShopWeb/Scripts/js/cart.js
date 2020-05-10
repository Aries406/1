// let cart = [];

// //gettting the products
// class Products {
//     async getProducts() {
//         try {
//             let result = await fetch('products.json');
//             let data = await result.json();

//             let products = data.items;
//             products = products.map(item => {
//                 const { title, price } = item.fields;
//                 const { id } = item.sys
//                 const image = item.fields.img.fields.file.url;
//                 return { title, price, id, image }
//             })
//             return products;
//         } catch (error) {
//             console.log(error);
//         }

//     }
// }

// //display products
// class UI {
//     displayProducts(products) {
//         let result = ''
//         products.forEach(product => {
//             // result +=
//             //     " <div class='block2-img wrap-pic-w of-hidden pos-relative block2_labelhot'> <
//             //     img src = 'images/item-01.jpg'
//             // alt = 'IMG-PRODUCT' >
//             //     <
//             //     div class = "block2-overlay trans-0-4" >
//             //     <
//             //     a href = "#"
//             // class = "block2_addwishlist hov-pointer trans-0-4" >
//             //     <
//             //     i class = "icon-wishlist icon_heart_alt"
//             // aria - hidden = "true" > < /i> <
//             //     i class = "icon-wishlist icon_heart dis-none"
//             // aria - hidden = "true" > < /i> <
//             //     /a> <
//             //     div class = "add_to_cart w-size1 trans-0-4" >
//             //     <
//             //     button class = "flex-c-m size1 bg4 bo-rad-23 hov1 s-text1 trans-0-4" >
//             //     <
//             //     /button> <
//             //     /div> <
//             //     /div> <
//             //     /div>

//             // <
//             // div class = "block2-txt " >
//             //     <
//             //     a href = "travel-detail.html"
//             // class = "block2_name dis-block s-text3 p-b-5" >
//             //     <
//             //     /a> <
//             //     h6 >
//             //     <
//             //     span class = "block2_price" >
//             //     <
//             //     /span>  <
//             //     /h6> <
//             //     /div></div > ";
//         });
//         productsDOM.innerHTML = result;
//         console.log(products)
//     }
// }
// //local storage
// class Storage {
//     static saveProducts(products) {
//         localStorage.setItem("products", JSON.stringify(Products));
//     }
// }

// document.addEventListener("DOMContentLoaded", () => {
//     const ui = new UI();
//     const products = new Products();

// })

// //get all products
// products.getProducts().then(products => {
//     ui.displayProducts(products);
//     Storage.saveProducts(products);
// });


// ************************************************
// Shopping Cart API
// ************************************************

let shoppingCart = (function() {
    cart = [];

    function Item(name, price, count) {
        this.name = name;
        this.price = price;
        this.count = count;
    }

    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    function loadCart() {
        cart = JSON.parse(localStorage.getItem('shoppingCart'));
    }
    if (localStorage.getItem("shoppingCart") != null) {
        loadCart();
    }
    let obj = Object;

    // Add to cart
    obj.addItemToCart = function(name, price, count) {
        for (let item in cart) {
            if (cart[item].name === name) {
                cart[item].count++;
                saveCart();
                return;
            }
        }
        let item = new Item(name, price, count);
        cart.push(item);
        saveCart();
    }

    // Set count from item
    obj.setCountForItem = function(name, count) {
        for (let i in cart) {
            if (cart[i].name === name) {
                cart[i].count = count;
                break;
            }
        }
    };
    // Remove item from cart
    obj.removeItemFromCart = function(name) {
        for (let item in cart) {
            if (cart[item].name === name) {
                cart[item].count--;
                if (cart[item].count === 0) {
                    cart.splice(item, 1);
                }
                break;
            }
        }
        saveCart();
    }

    // Remove all items from cart
    obj.removeItemFromCartAll = function(name) {
        for (let item in cart) {
            if (cart[item].name === name) {
                cart.splice(item, 1);
                break;
            }
        }
        saveCart();
    }

    // Clear cart
    obj.clearCart = function() {
        cart = [];
        saveCart();
    }

    // Count cart 
    obj.totalCount = function() {
        let totalCount = 0;
        for (let item in cart) {
            totalCount += cart[item].count;
        }
        return totalCount;
    }

    // Total cart
    obj.totalCart = function() {
        let totalCart = 0;
        for (let item in cart) {
            totalCart += cart[item].price * cart[item].count;
        }
        return Number(totalCart.toFixed(2));
    }

    // List cart
    obj.listCart = function() {
        let cartCopy = [];
        for (i in cart) {
            item = cart[i];
            itemCopy = {};
            for (p in item) {
                itemCopy[p] = item[p];
            }
            itemCopy.total = Number(item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy)
        }
        return cartCopy;
    }
    return obj;
})();

// Add item
$('.add_to_cart').click(function() {
    let travelMenu = $(this).parent().parent().parent();
    let imgTravel = travelMenu.find('img').get(0).src;
    let nameTravel = travelMenu.find('.block2_name').get(0).innerHTML;
    let travelPrice = travelMenu.find('.block2_price').get(0).innerHTML;

    swal({
        title: nameTravel + travelPrice,
        text: "已加入購物車 ! ",
        timer: 1000,
        icon: "success",
        button: false,
    });

    let cartItem = "<div class='cart_item'><div class='img_wrap'><img src='" + imgTravel + "' alt='' /></div><span>" + nameTravel + "</span><strong>" + travelPrice + "</strong><div class='cart_item_border'></div><div class='delete_item fas fa-trash-alt'></div></div>";

    setTimeout(function() {
        $("#cart .empty").hide();
        $("#cart").append(cartItem);
        $('.cart_amount').html(shoppingCart.totalCart());
        $("#cart .cart_item").last()
            .find(".delete_item").click(function() {
                $(this).parent().fadeOut(300, function() {
                    $(this).remove();
                    if ($("#cart .cart_item").length == 0) {
                        $("#cart .empty").fadeIn(100);
                    }
                })
            });
    }, 1000);

    displayCart();
    console.log(displayCart(), typeof(displayCart()))
});
// Clear items
$('.clear-cart').click(function() {
    shoppingCart.clearCart();
    displayCart();
});


function displayCart() {

    let imgTravel = $('#cart').find('img').src;
    let nameTravel = $('#cart').find('.block2_name').innerHTML;
    let travelPrice = $('#cart').find('.block2_price').innerHTML;
    let cartArray = shoppingCart.listCart();
    let cartItem = "";

    for (let i in cartArray) {

        cartItem += "<tr>" +
            "<td>" + cartArray[i].name + "</td>" +
            "<td>(" + cartArray[i].price + ")</td>" +
            "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>" +
            "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>" +
            "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>" +
            "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>" +
            " = " +
            "<td>" + cartArray[i].total + "</td>" +
            "</tr>";


    }

    $('.#cart').append(cartItem);
    $('.cart_amount').html(shoppingCart.totalCart());
    $('.amount_total').html(shoppingCart.totalCount());
}

// Delete item button

$('.show_cart').on("click", ".delete-item", function(event) {
    let name = $(this).data('name')
    shoppingCart.removeItemFromCartAll(name);
    displayCart();
})


// -1
$('.show_cart').on("click", ".minus-item", function(event) {
        let name = $(this).data('name')
        shoppingCart.removeItemFromCart(name);
        displayCart();
    })
    // +1
$('.show_cart').on("click", ".plus-item", function(event) {
    let name = $(this).data('name')
    shoppingCart.addItemToCart(name);
    displayCart();
})

// Item count input
$('.show_cart').on("change", ".item-count", function(event) {
    let name = $(this).data('name');
    let count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
});

displayCart();