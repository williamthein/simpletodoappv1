function itemTemplate(item){
    return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${item.text}</span>
            <div>
            <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
    </li>
    `
}
// Initial Page Load inserting items
let ourHTML = items.map(function(item){
    return itemTemplate(item)
}).join('')
document.getElementById('item-list').insertAdjacentHTML("afterbegin",ourHTML)

//Create item using axios
let createField = document.getElementById('create-field')
let itemList = document.getElementById('item-list')
document.getElementById('create-form').addEventListener('submit',function(e){
    e.preventDefault()
    axios.post('/create-item', {text: createField.value}).then(function(response){
        //create item
        itemList.insertAdjacentHTML("afterbegin" ,itemTemplate(response.data))
        createField.value = ""
        createField.focus()
    }).catch(function(){
        console.log('Error creating item')
    })
})

document.addEventListener('click', function(e){
    
    //Delete item
   if(e.target.classList.contains('delete-me')){
    if(confirm("Do you want to remove the item?")){
        let removeItemId = e.target.getAttribute('data-id')
        axios.post('/delete-item',{id: removeItemId }).then(function(){
            e.target.parentElement.parentElement.remove()
        }).catch(function(){
            console.log("Error Removing item")
        })
    }
   }
    //Update item
    if(e.target.classList.contains('edit-me')){
        let htmlInsert = e.target.parentElement.parentElement.querySelector('.item-text').innerHTML
        let userInput = prompt('Edit item?', htmlInsert)
        let itemId = e.target.getAttribute("data-id")
        if(userInput){
            axios.post('/update-item',{text: userInput, id: itemId}).then(function(){
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput
            }).catch(function(){
                console.log("Error Updating item")
            })
        }
    }
})