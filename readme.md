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
* [Features](#Features)
* [Issues](#Issues)

## URL
- https://masa-portfolio.net (For general user)
- https://masa-portfolio.net/admin/login (For admin)

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
- Developing environment: Docker
- Production environment: AWS EC2 / RDS

## Features

### User pages

- **Search, Filter, and Sort**: Find products, blogs, and news with various filtering and sorting options.
- **Personalized Recommendations**: Display products with personalized recommendations based on user's activity.
- **Bookmarks and Cart**: Manage bookmarks and cart for products.
- **Online Payment**: Complete purchases using Stripe’s test environment with provided test card details.
- **Activity History**: Review browsing and purchase history.
- **User Authentication**: Handle login, logout, and password resets via email.
- **User Authorization**: Members are allowed to bookmark, add to carts, and make purchases.
- **Member Management**: Handle account registration, profile updates, and account deletion.
- **Service Notifications**: Receive updates and service-related information.
- **User Inquiries**: Submit inquiries or order cancellations through the contact form.
  
### Admin pages

- **Master Data Management**: Manage master data such as sizes, colors, brands, categories, and tags.
- **Product Management**: Manage product information.
- **Data Export**: Export data as CSV files for easy offline sharing.
- **Search, Filter, and Sort**: Locate data using various filtering and sorting options.
- **Content Management**: Manage notifications related to services, news related to brands, and blogs promoting certain products.
- **Admin Authentication**: Handle login, logout, and password resets via email.
- **Admin Authorization**: Grant admins access to and control over all data.
- **Account Management**: Manage registration, profile updates, and deletion for both members and admins.
- **Inquiry Management**: Handle customer inquiries, including order cancellations.
- **Order Management**: Manage orders, including payment and shipping statuses.
  
## Issues 
 [Check here](https://github.com/users/masa-berl01102019/projects/2)
