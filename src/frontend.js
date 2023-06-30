window.addEventListener('DOMContentLoaded',()=>{

    let itemsInCart =  localStorage.getItem('ctclHiddenCart');


 if(null != itemsInCart){
    document.querySelector('.ctcl-floating-cart-item-count').textContent = JSON.parse(itemsInCart).length
 }else{
    document.querySelector('.ctcl-floating-cart-item-count').textContent = '0';
 }

    

    document.querySelector('.ctcl-floating-cart-icon').addEventListener('mouseenter',e=>{


        let subTotal = 0;
        let itemsInCart =  localStorage.getItem('ctclHiddenCart');
        let cartCont = document.querySelector('.ctcl-floating-cart-content');
        let iconBdRect = e.target.getBoundingClientRect();

        cartCont.style.left = `${iconBdRect.left-200+(iconBdRect.width/2)}px`;

       if(cartCont.querySelector('.ctcl-floating-cart-item-list') != null ){

        cartCont.removeChild(document.querySelector('.ctcl-floating-cart-item-list'))
       }



        if(null != itemsInCart){

            

            cartCont.querySelector('p').style.display = 'none';

            let itemsCont = document.createElement('div');
            itemsCont.classList.add('ctcl-floating-cart-item-list');



            let headerDisplay = document.createElement('div');
            headerDisplay.classList.add('ctcl-checkout-item-header');

            let imageHead = document.createElement('span');
            imageHead.className = 'ctcl-co-image-head';
            headerDisplay.appendChild(imageHead);

            let nameHead = document.createElement('span');
            nameHead.className = 'ctcl-co-name-head';
            nameHead.appendChild(document.createTextNode(ctclParams.itemHead));
            headerDisplay.appendChild(nameHead)

            let priceHead = document.createElement('span');
            priceHead.className = 'ctcl-co-price-head';
            priceHead.appendChild(document.createTextNode(ctclParams.priceHead));
            headerDisplay.appendChild(priceHead)

            let qunHead = document.createElement('span');
            qunHead.className = 'ctcl-co-qty-head';
            qunHead.appendChild(document.createTextNode(ctclParams.qtyHead));
            headerDisplay.appendChild(qunHead)

            let itemTotHead = document.createElement('span');
            itemTotHead.className = 'ctcl-co-item-total-head';
            itemTotHead.appendChild(document.createTextNode(ctclParams.itemTotalHead));
            headerDisplay.appendChild(itemTotHead)

            itemsCont.appendChild(headerDisplay);

            


            let cartItems = JSON.parse(itemsInCart);

            for(let i in cartItems){



                let itemTotal = parseInt(cartItems[i].qty) * parseFloat(cartItems[i].price);
                subTotal += itemTotal;


                let itemDisplay = document.createElement('div');
                itemDisplay.id = `ctcl-checkout-item-${i}`;
                itemDisplay.classList.add('ctcl-checkout-item');

                let imgSpan = document.createElement('span');
                imgSpan.classList.add('ctcl-checkout-item-img-span');
                let itemImg = new Image();
                itemImg.src = cartItems[i].pic;
                itemImg.style.marginLeft='2px';
                imgSpan.appendChild(itemImg);
                itemDisplay.appendChild(imgSpan);

                let itemName = document.createElement('span');
                itemName.classList.add('ctcl-checkout-item-name');
                itemName.appendChild(document.createTextNode(cartItems[i].name));
                itemDisplay.append(itemName);

         
                let itemPrice = document.createElement('span');
                itemPrice.classList.add('ctcl-checkout-item-price');
                itemPrice.appendChild(document.createTextNode(cartItems[i].price));
                itemDisplay.append(itemPrice);

                let itemQty = document.createElement('span');
                itemQty.classList.add('ctcl-checkout-item-qty');
                itemQty.appendChild(document.createTextNode(cartItems[i].qty));
                itemDisplay.append(itemQty);

                let itemTotalSpan = document.createElement('span');
                itemTotalSpan.classList.add('ctcl-checkout-item-total');
                itemTotalSpan.appendChild(document.createTextNode(itemTotal.toFixed(2)));
                
                itemDisplay.append(itemTotalSpan);

                itemsCont.appendChild(itemDisplay);

            }


            let subTotalCont = document.createElement('div');
            subTotalCont.id = "ctcl-subtotal-container";

            let subTotalLabel = document.createElement('span');
            subTotalLabel.classList.add('ctcl-sub-total-label');
            subTotalLabel.appendChild(document.createTextNode(ctclParams.subTotal + ' (' + ctclParams.currency + ') : '));
            subTotalCont.appendChild(subTotalLabel);


            let subTotalVal = document.createElement('span');
            subTotalVal.classList.add('ctcl-total-shipping-cost');
            subTotalVal.appendChild(document.createTextNode(parseFloat(subTotal).toFixed(2)));
            subTotalVal.style.marginRight = '5px';
            subTotalCont.appendChild(subTotalVal);
            
            itemsCont.appendChild(subTotalCont);


            cartCont.appendChild(itemsCont);


        

        }else{

            
            cartCont.querySelector('p').style.display = '';

        }

        cartCont.style.display = ''
    });

    document.addEventListener('addRemoveProduct', e=>{
        document.querySelector('.ctcl-floating-cart-item-count').textContent =  e.detail;
    });

    document.querySelector('.ctcl-floating-cart-icon').addEventListener('mouseout',e=>{
        document.querySelector('.ctcl-floating-cart-content').style.display = 'none';
    })


})