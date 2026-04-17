import { CreateCustomer,createPaymentMethods,create_payment,addPaymentMethodToUser,getProducts,getProductPrice } from './src/function.js'

//Vamos a hacer un flujo completo a ver si sale todo correcto
const id_usuario = await CreateCustomer("Richard","richard@test.com") //Creo un usuario en Stripe
const metodo_pago = await createPaymentMethods() //Creo la tarjeta de prueba
await addPaymentMethodToUser(id_usuario,metodo_pago) //Viculo el método de pago al usuario
const producto = await getProducts(); //Devuelve todos los productos
const {precio_efectivo, moneda} = await getProductPrice(producto); //Adquiere el precio y en qué moneda se encuentra
await create_payment(metodo_pago,id_usuario,producto,precio_efectivo,moneda); //Realizo el pago con el ID de la tarjeta del paso anterior y los datos dinámicos de precio y moneda del producto