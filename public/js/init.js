var body = $(".l-main");
var mainTitle = $(".c-title--main");
var store;
var mainTitleContent = "";
var total = 0;
var imgSources = [];
var closeBtn;
var updateBtn;

request();

function request() {
    $.ajax({
        type: "get",
        url: "/api/products",
        success: function(data) {
            store = data;
            successHandler();
        }
    });
}

function successHandler() {
    populateTemplates();
    setMainTitle();
    setItemImage();
    closeBtn = $(".fa-times");
    closeBtn.on("click", closeItem);
    setUpdateTotal();
    setMakePurchase();
}

function populateTemplates() {
    jQuery.each(store.products, function(i, el) {
        appendItem(el);
    });
    body.append(createPurchaseBtn());
}

function setMainTitle() {
    jQuery.each(store.searchVehicle, function(k, val) {
        mainTitleContent += " " + val;
        mainTitle.html(mainTitleContent);
    });
}

function setItemImage() {
    var img = $(".c-item__img");
    getImgSrc();
    $(".c-item__img").each(function(i, el) {
        $(this).css("background-image", "url(" + imgSources[i] + ")");
    });
}

function closeItem() {
    this.closest(".c-item").remove();
}

function setUpdateTotal() {
    updateBtn = $(".c-item__info-submit");

    updateBtn.on("click", function(e) {
        e.preventDefault();

        var index = updateBtn.index(this);
        var quantity = $(".c-item__info-quantity").eq(index).val();
        var msg;
        setTotal(quantity, index);
    });
}

function createItemImage() {
    return '<div class="c-item__img"> </div>';
}

function createItemInfoTitle(el) {
    return (
        '<div class="c-item__info-title">' +
        '<span class="c-title--info-main">' +
        el.pName +
        "</span>" +
        ' <span class="c-item__info-number c-title--sub-italic"> Product #' +
        el.id +
        "</span>" +
        "</div>"
    );
}

function createItemInfoMain(el) {
    return (
        '<div class="c-item__info-main">' +
        '<span class="c-item__info-vehicle"><span class="c-title--sub-straight">Vehicle:</span>' +
        el.vehicle.year +
        " " +
        el.vehicle.make +
        " " +
        el.vehicle.model +
        " " +
        el.vehicle.name +
        " " +
        el.vehicle.option +
        " " +
        el.vehicle.year +
        " " +
        "</span>" +
        '<div class="l-item__info-description">' +
        '<span class="c-item__info-chars"><span class="c-title--sub-straight">Size/Style:</span>' +
        el.vehicle.sizeChosen +
        "</span>" +
        '<span class="c-item__info-price c-title--sub-upper">$' +
        el.pPrice +
        "</span>" +
        "</div>" +
        "</div>"
    );
}

function createItemInfoSubmission(el) {
    return (
        '<div class="c-item__info-submission">' +
        '<form action="#" class="c-item__info-quantity-form">' +
        '<label for="qty" class="c-title--sub-upper">qty:</label>' +
        '<input type="number" name = "qty" id="qty" class="c-item__info-quantity" value="0">' +
        '<input type="submit" value="Update" class="c-item__info-submit c-title--sub-italic">' +
        "</form>" +
        '<span class="c-item__info-total c-title--sub-upper">Total: $' +
        total +
        "</span>" +
        "</div>"
    );
}

function createItemInfo(el) {
    return (
        '<div class="c-item__info">' +
        createItemInfoTitle(el) +
        createItemInfoMain(el) +
        createItemInfoSubmission(el) +
        "</div>"
    );
}

function createItem(el) {
    return (
        '<div class="c-item">' +
        '   <button class="c-item__close-btn"><i class="fa fa-times" aria-hidden="true"></i></button>' +
        createItemImage(el) +
        createItemInfo(el) +
        "</div>"
    );
}

function appendItem(el) {
    body.append(createItem(el));
}

function getImgSrc() {
    jQuery.each(store.products, function(i, el) {
        if (el.imgUrl) {
            imgSources.push(el.imgUrl);
        }
    });
}

function populateItemImage(el) {
    jQuery.each(store.products, function(i, el) {
        appendItem(el);
    });
}

function createPurchaseBtn() {
    return (
        '<div class="c-action">' +
        '<button class="c-action__btn"><i class="fa fa-plus" aria-hidden="true"></i> Buy</button>' +
        "</div>"
    );
}

function createError(msg) {
    return (
        '<div class="c-warning">' +
        '<div class="c-warning__sign"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' +
        "</div>" +
        '<div class="c-warning__message">' +
        msg +
        "</div>" +
        "</div>"
    );
}

function setMakePurchase() {
    var purchaseButton = $(".c-action__btn");
    purchaseButton.on("click", function() {
        console.log("Спасибо за покупку!");
    });
}

function setTotal(quantity, index) {
    if (quantity > 0 && quantity < 11) {
        var currentPrice = store.products[index].pPrice;
        total = quantity * currentPrice;
        $(".c-item__info-total").eq(index).html("total:$" + total);
    } else if (quantity == 0) {
        msg = "Please set QTY";
        $(".c-item").eq(index).before(createError(msg));
        $(".c-item__info-quantity").eq(index).css("border","1px solid red");
        removeWarning(index);
    } else if (quantity > 10) {
        msg = "Sorry, the maximum quantity you can order is 10";
        $(".c-item").eq(index).before(createError(msg));
        $(".c-item__info-quantity").eq(index).css("border","1px solid red");
        removeWarning(index);
    }
}

function removeWarning(index) {
    setTimeout(function() {
        $(".c-warning").remove();
        $(".c-item__info-quantity").eq(index).css("border","1px solid grey");
    }, 1100);
}
