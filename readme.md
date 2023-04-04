# E-commerce Portfolio - Laravel + React

## Project Outline
- E-commerce service managed by an domestic apparel company which has multiple brands.
- The target customers is living in Japan, so Timezone is Asia/Tokyo.
- Managing stocks of products and finance is out of scope in this project.

### cautions
- Demo data of products is registered by using Yahoo searching items API when seed command is executed, so there is some difference between data and the facts like colors of images doesn't correpond with color which is displayed.
- This portfoliio can switch language, but some data which is registered by external API such as Yahoo searching items API has been registered in Japanese so it doesn't change even though switching language.

## Table of Contents
* [URL](#URL)
* [Test Account](#Test-Account)
* [Technology Stacks](#Technology-Stacks)
* [How to Use](#How-to-Use)
* [Features](#Features)
* [Issues](#Issues)

## URL
- https://ecommerce-portfolio.fly.dev (For general user)
- https://ecommerce-portfolio.fly.dev/admin/login (For admin)

## Test Account
- ID: user@test.com / PASSWORD: abc12345
- ID: admin@test.com / PASSWORD: abc12345
    
    It's been set already at login form

## Technology Stacks
- Front-end: HTML/CSS/Javascript/React.js
- Back-end: PHP/laravel
- Database: MySQL
- Main external API: Sanctum / Stripe etc
- Main library: axios/react-query/recoil/i18next/react-cookie/react-draft-wysiwyg/varidatorjs etc
- Developing environment: VirtualBox/Vagrant/Homestead
- Production environment: Fly.io(PaaS)/PlanetScale(DBaaS)

## How to Use
- デモ画像と説明文を記載

## Features

### Features of user pages

Main information such as products, blogs and news can be searched by filter and sort. Regarding products, it's displayed as browsing history.
Basically, there are features for managing information of members, which can provide authentication such as login and logout, then reset passwords through sending an email. 
Members can bookmark favorite products, besides they can also add it to their cart then purchase it with credit payment. ( * which is executed by test environment of Stripe, so it never sent you a bill even if you purchased products on this portfolio site. )
After that, they can see order history, which can add it to their cart again and easily.
There are features of receiving notifications related with services and contact with admins for asking about services and cancelation of orders so that users can use it comfortably.
  
### Features of admin pages
Admin pages are managing product information, master data such as sizes, colors, brands, categories and tags. 
Besides, it can post notifications regarding service, news which is related with general information for brands and blog for promoting certain products. 
There are features for managing information of users and admins, which can provide authentication such as login and logout, then reset passwords through sending an email. 
Basically, most of data can output as a CSV file for sharing offline easily. 
It receives inquiries of general customers so that admins can manage it, for instance cancellation of their orders.
Last but not least, admin page also has feature of managing orders.
  
## Issues 
 [Check here](https://github.com/users/masa-berl01102019/projects/2)
