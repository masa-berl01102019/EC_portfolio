# E-commerce Portfolio - Laravel + React

## Project Outline
- E-commerce service managed by an domestic apparel company which has multiple brands.
- The target customers is living in Japan, so Timezone is Asia/Tokyo.
- Managing stocks of products and finance id out of scope in this project.

## Table of Contents
* [URL](#URL)
* [Test Account](#Test-Account)
* [Technology Stacks](#Technology-Stacks)
* [How to Use](#How-to-Use)
* [Features](#Features)

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
- For general user
  + Authentication
  + User CRUD operations
  + Reset and change passwords
  + Contact form 
  + Display / search products 
  + Add / delete bookmarks 
  + Add / delete carts
  + Display browsing history
  + Display user's order history
  + Purchase products
  + Display / search Blogs
  + Display / search News
  + Display notifications
- For Admin 
  + Authentication
  + Reset and change passwords
  + Item CRUD operations / Output CSV
  + Notification CRUD operations / Output CSV
  + News CRUD operations / Output CSV
  + Blog CRUD operations / Output CSV
  + Admin CRUD operations / Output CSV
  + User CRUD operations / Output CSV
  + Update / Delete contacts
  + Update order status / Output CSV
  + Size CRUD operations
  + Color CRUD operations
  + Brand CRUD operations
  + Category CRUD operations
  + Tag CRUD operations
