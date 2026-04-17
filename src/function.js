import Stripe from 'stripe';

process.loadEnvFile();

const API_KEY = process.env.STRIPE_API_KEY_PRIVATE || console.error("Debe de configurar la variable STRIPE_API_KEY_PRIVATE para que funcione el proyecto")

const stripe = new Stripe(API_KEY)

//Función que crea el método de pago
export async function createPaymentMethods () {
    const payment = await stripe.paymentMethods.create(
        {
            'type':'card',
            'card':{'token':'tok_visa'}
        },
    )
    
    return payment.id;
}

//Función que crea el pago con la tarjeta creada en la función createPaymentMethods
export async function create_payment(payment_method_id,customer_id,productId,amount,currency){
    const compra = await stripe.paymentIntents.create({
        amount:amount,
        currency:currency,
        customer:customer_id,
        payment_method:payment_method_id,
        payment_method_types:["card"],
        confirm:true,
        metadata:{
            'product_id':productId
        }
    })

    console.log(`Pago realizado con ID ${compra.id} correctamente.`)
}

//Función que crea un usuario en el sistema
export async function CreateCustomer (name,email) {
    const customer = await stripe.customers.create({
        name:name,
        email:email,
    })

    console.log(`Usuario ${customer.name} creado satisfactoriamente`)
    return customer.id
}

//Función que asocia método de pago al usuario
export async function addPaymentMethodToUser(client_id,payment_method_id) {
    await stripe.paymentMethods.attach(
        payment_method_id,
        {customer:client_id}
    )
    console.log('Método de pago asociado al usuario')
}

//Función que retorna el ID del producto activo de la posición 0
export async function getProducts() {
    const productos = await stripe.products.list()
    return productos["data"][0]["id"]
}

//Función que retorna el precio y en qué moneda se encuentra el mismo del ID de producto que le pasen
export async function getProductPrice(productId) {
    const precio = await stripe.prices.list({product:productId})
    const precio_efectivo = precio["data"][0]["unit_amount"]
    const moneda = precio["data"][0]["currency"]
    
    return {precio_efectivo, moneda}
}