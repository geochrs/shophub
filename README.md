![1](https://github.com/geochrs/shophub/assets/125922884/d10d81c6-aa50-424c-900c-a134303c939e)

<h1 align="center">
Shophub
</h1>
<p align="center">
A complete ecommerce for all of your shopping needs!
</p>

## Features

:radio_button: Secure user registration and authentication. <br>
:radio_button: Secure Payments with Stripe. <br>
:radio_button: Browse available products added by the admin. <br>
:radio_button: Add/remove products to the shopping cart. <br>
:radio_button: Generate bills in PDF form for every order. <br>

## Technology

The application is built with:

:radio_button: Node.js <br>
:radio_button: MongoDB <br>
:radio_button: Express <br>
:radio_button: Bootstrap <br>
:radio_button: Stripe <br>
:radio_button: Cloudinary <br>
:radio_button: Passport

## Run it locally

1. Install mongodb
2. Clone the repo locally using:
```
https://github.com/geochrs/shophub.git
cd shophub
npm install 
```
3. Create a `.env` file in the root of the project and add the following:
```
DB_URL='<url>'
CLOUDINARY_CLOUD_NAME='<name>'
CLOUDINARY_KEY='<key>'
CLOUDINARY_SECRET='<secret>'
SECRET='<secret>'
STRIPE_KEY = '<stripe_key>'
```
4. Run the server :
```
node app.js
go to localhost:3000
```

