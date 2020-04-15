# otp_Authentication

# Application Dependencies
.Node js
.npm
.Sequelize
.ejs

# Steps To Application Setup
1) Clone the application from https://github.com/mukkudhiman23/otp_Authentication.git by running the following command:
    
    git clone https://github.com/mukkudhiman23/otp_Authentication.git

2) Install npm module  

   npm install 

3) Configuration

   Before continuing further we will need to tell the CLI how to connect to the database. To do that let's open default config file config/config.json. It looks something like this:

  {
    "development": {
      "username": "root",
      "password": null,
      "database": "database_development",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": "root",
      "password": null,
      "database": "database_production",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
  }

4) Running Migrations

   npx sequelize-cli db:migrate

5) Run this command to run application

   node app.js
   
 6) Hit http://localhost:4000/ to visit home page.  
   
