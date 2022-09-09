
const submitBtn = document.getElementById("submitBtn");
const addBtn = document.getElementById('addBtn')
const outputList = document.getElementById('output-list')
const printbtn = document.getElementById('printbtn')


let locastorage = localStorage.getItem('items');
let Items = locastorage? JSON.parse(locastorage) : [];

const setValue = (qty, productName, price) =>{
    //  console.log(qty,price,productName);
     const ItemDesc ={
        qty : qty,
        productName : productName,
        productPrice : price,
     }
     
     Items.push(ItemDesc);
     localStorage.setItem('items',JSON.stringify(Items))
     location.reload()
     showList()
}

submitBtn.addEventListener( 'click',() => {
    let op='';
    let result = calculateTax(Items)
    // console.log(result)
    for(let i =0 ;i< result.length-2 ; i++){
        // console.log(result[i].name)
        op += `<li class="list-group-item"> ${result[i].qty+" "+result[i].name+" : "+ result[i].price}</li>`
    }
    op += `<li class="list-group-item">Sales Taxes : ${result[result.length-2]}</li>`
    op += `<li class="list-group-item">Total : ${result[result.length-1]}</li>`

    outputList.innerHTML = op;
    
})


addBtn.addEventListener('click', ()=>{
    const Qty = document.querySelector("#quantityNumber");
    const productName = document.getElementById('productName');
    const Price = document.getElementById('price');
    setValue(Qty.value,productName.value,Price.value);
})

printbtn.addEventListener('click',()=> window.print())



const showList = () =>{
    //  console.log(Items);
    let outPut =''
    let productLists = document.getElementById('productLists')
    Items.map((data, index) => {
        // console.log(data.productName)
        outPut+=`<li class="list-group-item ">${data.qty+"  Piece : "+ data.productName} at ${data.productPrice}
        <button type="button" onClick= "deleteItems(${index})" class="btn dlt-btn btn-danger">Delete</button>
        </li>
        `
    });
    productLists.innerHTML= outPut;
}

const deleteItems = (e) => {
    let filteredItems = Items.filter((data,index) =>{
        return index !== e
    })
    localStorage.setItem('items', JSON.stringify(filteredItems))
    location.reload();
}
showList();

const rounder = (number) => (Math.ceil(number*20) / 20).toFixed(2);

const calculateTax = (Items) =>{
    // console.log(Items[0])
    let totalPrice=0, SalesTax=0;
    let productsSummary=[]
    Items.map((item) =>{
       let itemData ={
        qty : item.qty,
        name : String(item.productName),
        price : Number(item.productPrice),
       } 
       let currPrice = itemData.price * itemData.qty;
       let tempPrice = itemData.price * itemData.qty;
       let tax= (currPrice*10)/100;

       if( itemData.name.includes("book") ||  itemData.name.includes("chocolates") || itemData.name.includes("pills")){
        totalPrice += currPrice; 
       }else{
        SalesTax += tax;
        currPrice += tax;
        totalPrice += currPrice;
        itemData.price = rounder(currPrice);
       }

       if(itemData.name.includes("imported")){
        SalesTax += (tempPrice*5)/100 ;
        currPrice += (tempPrice*5)/100 ;
        totalPrice += (tempPrice*5)/100 ;
        itemData.price = rounder(currPrice);
       }
    //    console.log(itemData)
       productsSummary.push(itemData);
       
    })
    productsSummary.push(rounder(SalesTax),totalPrice.toFixed(2))
    return productsSummary
}

