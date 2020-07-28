const numberToCurrency = price => {
    return new Intl.NumberFormat('USD', {
        currency: 'USD',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price_car').forEach(nodeElem => {
    nodeElem.textContent = numberToCurrency(+nodeElem.textContent)
})

const $basket = document.querySelector('.basket')

if($basket) {
    $basket.addEventListener('click', eve => {
        if(eve.target.matches('.js-action')){
            const id = eve.target.dataset.id
            const csrf = eve.target.dataset.csrf
            
            fetch('/basket/delete/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(data => data.json()).then(data => {
                if(data.cart.length) {
                    const html = data.cart.map(c => {
                        return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.amount}</td>
                                <td>${c.price}</td>
                                <td>
                                    <button class="btn btn-danger js-action" data-id="${c._id}" data-csrf="${csrf}">Delete</button>
                                </td>
                            </tr>
                        `
                    }).join('')
    
                    $basket.querySelector('tbody').innerHTML = html
                    $basket.querySelector('.price_car').textContent = numberToCurrency(data.price)
                } else {
                    $basket.innerHTML = `<p>Your bag is empty</p>`
                }
            })
        }
    })
}

M.Tabs.init(document.querySelectorAll('.tabs'))
