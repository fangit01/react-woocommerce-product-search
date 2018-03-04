# react-woocommerce-product-search
a simple react app for the WooCommerce store owners/store managers to efficiently search products in your store.

# Benefits
1. Faster - No need to login to your wordpress admin panel or your website
2. As the default WordPress or WooCommerce search function is not accuracy, this app provide a filtered search result such as keywords in product title or keywords in product attibute. 
3. You can make your own .command file: create an empty myCommandScript.txt file ,add
```#! /bin/bash 
cd ~/this-repo-dir-in-your-computer
npm start
```
change file extension from .txt to .command
open terminal:  
```
chmod u+x ~/myCommandScript.command
```

# WARNING
* this app is meant for **localhost use ONLY!** Please **DO NOT** deploy as your api keys will be exposed.
* For security reason, please genereate Read Only api keys.
* Please keep this file in a private computer as anyone who can access this file can copy your api keys, thus fetch private data such as customer details / orders from your website.

# HOW TO USE
1. Go to your WooCommerce setting, generate a read-only api keys. 
2. in the src/app.js, add your website, api keys
3. npm install
4. npm start

# Screenshot
![screenshot](./screenshot.jpeg?raw=true "screenshot")