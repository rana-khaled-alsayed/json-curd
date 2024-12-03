// inputs table
let inputs=document.querySelectorAll('input');
let span =document.querySelectorAll('#span');
let span3 =document.querySelector('#span3');
let span4 =document.querySelector('#span4');
let product_cost= document.querySelectorAll('#product-cost input');
let span2 = document.querySelectorAll('#product-cost #span2');
let productName= document.getElementById('productName');
let category=document.getElementById('category');
let costIput=document.querySelectorAll('#product-cost input');
let count =document.querySelector('#count');
let img= document.querySelector('#img');
let imagetester = /^(https:\/\/.*)$/i;
let addProductBtn=document.querySelector('#addProductBtn');
// products table
let products_table=document.querySelector('.table');
let empty= document.querySelector('.empty');
let deleteAll = document.querySelector('.deleteAll');
let tbody=document.querySelector('tbody');
let overlay= document.querySelector('#overlay');
let confirm_modal= document.querySelector('#confirm-modal');
let modalBtnClose = document.querySelector('#modalBtnClose');

let GlobalId;
let allProducts ;
let Mood= 'create';
let errors= ['invaild'];
let numerorrs= ['invalid'];




let validation= () =>{
    for(let i = 0 ; i < inputs.length; i++){
        if(inputs[i].value.length == 0){
            errors.push(`error in that ${inputs[i].getAttribute('id')}`);
        }else{
            errors.splice(0);
            console.log(errors)
        }
    }
}

for(let i =0; i< inputs.length ; i++){
    inputs[i].addEventListener("change",validation);
}


let imageValidation= () =>{
    let url= img.value;
      if(!imagetester.test(url)){
        img.classList.add("invalid");
        span3.classList.remove("none");
        span3.innerHTML =`you must enter url`;
        return false;
      }else{
        img.classList.remove("invalid");
        span3.classList.add("none");
        return true;
      }
    }
img.addEventListener("keyup", imageValidation);

let numvalidation= () =>{
    for(let b = 0 ; b < product_cost.length; b++){
        if(parseFloat(product_cost[b].value) < 0){
            numerorrs.push(`error in that ${product_cost[b].getAttribute('id')}`);
        }else{
            numerorrs.splice(0);
            console.log(numerorrs);
        }}
}
for(let b=0 ; b < product_cost.length; b++){
product_cost[b].addEventListener("change", numvalidation);
}

if(localStorage.products==null){
    allProducts=[];
}else{
    allProducts=JSON.parse(localStorage.getItem('products'));
}
 
let checkfun= ()=>{
    if(localStorage.length == 0 || tbody.childElementCount == 0){
    products_table.classList.add('none');
    deleteAll.classList.add('none');
    empty.classList.remove('none');
    }else{
    products_table.classList.remove('none');
    deleteAll.classList.remove('none');
    empty.classList.add('none');
    }
}


let calculator= () =>{
  let cost=costIput[0].value;
  let tax=costIput[1].value;
  let profit=costIput[2].value;
  let net_profit=costIput[3].value;
  let selling_price=costIput[4].value;

  let tax_cost= +cost * (+tax / 100);
  let cost_af_tax =+cost + +tax_cost;
  let profit_count= +cost * (+profit /100);
  let profit_and_cost =+cost_af_tax + +profit_count;

  costIput[3].value= Math.ceil(+profit_count);
  costIput[4].value= Math.ceil(+profit_and_cost);

}
for (let i = 0; i < costIput.length; i++) {
    costIput[i].addEventListener('keyup',calculator);
}

let show_data= () =>{
    let table_row = " ";
    for(let i=0 ; i < allProducts.length; i++){
        console.log(allProducts[i]);
        table_row += `<tr>
        <th> ${i+1}</th>
        <th> ${allProducts[i].productName} </th>
        <th> ${allProducts[i].category} </th>
        <td><i onclick="viewOneItem(${i})"  class="fa-regular fa-eye" style="color: #74C0FC;"></i> </td>
        <td> <i onclick="UpdateOneItem(${i})" class="fa-regular fa-pen-to-square" style="color: #B197FC;"></i></td>
        <td><i onclick="removeOneItem(${i})"  class="fa-solid fa-trash" style="color: #b83232;"></i> </td>
        </tr>`
    }
    tbody.innerHTML=table_row;
    checkfun();
}
let restInputs =() =>{
   productName.value="";
   category.selectedIndex = 0;
   costIput[0].value="";
   costIput[1].value="";
   costIput[2].value="";
   costIput[3].value="";
   costIput[4].value="";
   count.value = "";
   img.value="";
}

// Validate individual inputs in real-time
let realTimeValidation = () => {
    let allValid = true;

    // Validate each input field
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() === "") {
            inputs[i].classList.add("invalid");
            span[i].classList.remove("none");
            span[i].innerHTML = `you must enter something`;
            allValid = false;
        } else {
            inputs[i].classList.remove("invalid");
            span[i].classList.add("none");
        }
    }

    // Validate numeric inputs
    for (let b = 0; b < product_cost.length; b++) {
        if (parseFloat(product_cost[b].value) < 0) {
            product_cost[b].classList.add("invalid2");
            span2[b].classList.remove("none");
            span2[b].innerHTML = `You must enter a positive number`;
            allValid = false;
        } else {
            product_cost[b].classList.remove("invalid2");
            span2[b].classList.add("none");
        }
    }

    // Validate category selection
    if (category.value === "") {
        category.classList.add("invalid");
        span4.classList.remove("none");
        span4.innerHTML = `You must choose one`;
        allValid = false;
    } else {
        category.classList.remove("invalid");
        span4.classList.add("none");
    }

    // Validate image URL
    if (!imageValidation()) {
        allValid = false;
    }

    return allValid;
};

// Attach event listeners to all inputs for real-time validation
inputs.forEach(input => {
    input.addEventListener("keyup", realTimeValidation);
    input.addEventListener("change", realTimeValidation);
});

product_cost.forEach(input => {
    input.addEventListener("keyup", realTimeValidation);
    input.addEventListener("change", realTimeValidation);
});

category.addEventListener("change", realTimeValidation);
img.addEventListener("keyup", imageValidation);


let create_object = () => {
    if (!realTimeValidation()) {
        console.log("Validation failed. Product not added.");
        return;
    }
    // Create new product object
    let new_product = {
        productName: productName.value,
        category: category.value,
        cost: costIput[0].value,
        tax: costIput[1].value,
        profit: costIput[2].value,
        net_profit: costIput[3].value,
        selling_price: costIput[4].value,
        img: img.value,
    };

    // Handle Create or Update mode
    if (Mood === 'create') {
        if (count.value <= 1) {
            allProducts.push(new_product);
        } else {
            for (let i = 1; i <= count.value; i++) {
                allProducts.push(new_product);
            }
        }
    } else {
        allProducts[GlobalId] = new_product;
        count.disabled = false;
        addProductBtn.innerHTML = `Add Product`;
        addProductBtn.classList.replace('btn-update', 'btn-primary');
        let inputs = document.querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.border = "1px solid #ccc";
        }
        category.style.border = "1px solid #ccc";
        Mood = 'create';
    }

    // Save to local storage
    localStorage.setItem('products', JSON.stringify(allProducts));
    show_data();
    restInputs();
    checkfun();
};



show_data();
addProductBtn.addEventListener('click',create_object);
checkfun();

let removeOneItem = (i) =>{
    allProducts.splice(i,1);
    localStorage.products=JSON.stringify(allProducts);
    show_data();
}

let viewOneItem = (i) =>{
    overlay.style.display="block";
    confirm_modal.style.display="block";
    confirm_modal.innerHTML= `
    <div class="card" id="modal-card">
    <div class="card-body" style="padding: 0px; width: 100%;" >
    <div class="btndiv">
     <button onclick="closemodal()" id="modalBtnClose" class="btn btn-danger"><i class="fa-solid fa-xmark" style="color: #ffffff;"></i></button>
     </div>
     <img width='110' src= '${allProducts[i].img}'><hr>
      <h6> Product Price : ${allProducts[i].cost} </h6><hr>
      <h6> Tax Percentage :${allProducts[i].tax} % </h6> <hr>
      <h6> Profit percentage :${allProducts[i].profit} %</h6><hr>
      <h6>  Net Profit :${allProducts[i].net_profit} </h6><hr>
      <h6> Selling Price : ${allProducts[i].selling_price} </h6>
      </div>
      </div>
    `
}
let closemodal = () =>{
    overlay.style.display="none";
    confirm_modal.style.display="none";
}
overlay.addEventListener('click',closemodal);

let UpdateOneItem = (i) =>{
    Mood ='update';
    GlobalId= i ;
    productName.value= allProducts[i].productName;
    category.value= allProducts[i].category;
    costIput[0].value= allProducts[i].cost;
    costIput[1].value= allProducts[i].tax;
    costIput[2].value= allProducts[i].profit;
    costIput[3].value= allProducts[i].net_profit;
    costIput[4].value= allProducts[i].selling_price;
    count.value =  allProducts[i]. count;
    img.value= allProducts[i].img;
    count.disabled=true;
    addProductBtn.innerHTML=`Update Product ${i +1}`;
    addProductBtn.classList.replace('btn-primary','btn-update');
    let inputs = document.querySelectorAll('input');
    for(let i=0; i < inputs.length;i++){
        inputs[i].style.border="3px solid rgb(164, 122, 204)";
    }
    category.style.border="3px solid rgb(164, 122, 204)";
    
}

let clearAll= () =>{
    localStorage.clear();
    allProducts.splice(0);
    show_data();
    checkfun();
}
deleteAll.addEventListener('click',clearAll);