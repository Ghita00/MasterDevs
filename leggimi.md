<a href="https://www.families-share.eu/"><img src="https://live.comune.venezia.it/sites/live.comune.venezia.it/files/styles/tb-wall-single-style/public/field/image/FamiliesShare-1200x672.jpg?itok=rcGCGBQW" title="Families_Share" alt="Families Share Logo"></a>

# Families Share Platform

> Funded under the Information and Communication Technologies programme of Horizon 2020’s Industrial Leadership component, and its call for collective awareness platforms for sustainability and social innovation, the Families_Share project is developing a social networking and awareness-raising platform dedicated to encouraging childcare and work/life balance. The platform capitalises on neighbourhood networks and enables citizens to come together to share tasks, time and skills relevant to childcare and after-school education/leisure, where these have become unaffordable in times of stagnation and austerity.

## Families_Share Platform Deployment instructions

### Initialization
   - If the user doesn’t have Node.js locally installed on their machine they can get and install the latest version from:  [NodeJS](https://nodejs.org/en/download)

   - In addition, the user needs to have a Google account. Any Gmail account is a valid developer account. If they don’t have one, they can create one at: [Google Account](https://accounts.google.com)
  
  - The user needs to create a new Google project and a service account, as they will need the key from the service account in order to access the Google APIs from their Node.js client. Subsequently they need to enable the Google Calendar API that is necessary for the calendar features of the platform. All the above functionalities can be accessed from Google’s developer console. The following links can act as a guide for the above actions:  [Google Project](https://cloud.google.com/resource-manager/docs/creating-managing-projects), [Google Service Account ](https://cloud.google.com/iam/docs/creating-managing-service-account-keys), [Google APIs](https://support.google.com/googleapi/answer/6158841?hl=en)

   - In case the user wants to enable single sign on with Google, which is supported by the platform they will need to create an OAuth client ID from their Google developer console credential’s section. During the creation of the OAuth client ID the user needs to select “Web application” as the type and authorize redirects to <http://localhost:4000> and their production server URL in order to use this functionality both in development and production.
   
   - An additional email account is needed, that will act as the platform’s email account which notifies the users for platform specific events.
   
   - In case the user wants to enable front-end error logs in production they will need a SENTRY account and a Sentry React project. These  canbe created at: [Sentry](https://sentry.io/login)

   - Finally,in case the user wants to opt in for analytics in your production deployment they will need a Google Analytics account. You can create one at : [Google Analytics](https://analytics.google.com/analytics/web/provision/?authuser=0#/provision/create)

### Deployment
   - At first the user needs a clone of the Families Share repository. They may acquire one from: [Code](https://github.com/vilabs/Families_Share-platform)
   - Alternatively, if the user has Git locally installed on their machine, they can run the following command in their terminal:
   
```javascript
git clone https://github.com/vilabs/Families_Share-platform
```

   - After that the user has to install package dependencies both for client and server application by running the following command in the respective folders:

```javascript
npm install
```
(se non funziona modificare le dipendenze nel package con le proprie versioni di codice)
- cambiare il .env.sample del server e del client in .env e compilare le seguenti informazioni:
(-) => facoltativo
   - lato server:

      - DB_DEV_HOST= would probably be something like mongodb://localhost/families_share ( families share is the db name . you can change it to something else if you want)
      - HTTP_PORT= e.g. 4000. port that the server will run.
      - SERVER_SECRET= the secret key that is used in token creation and verification. You can create one here https://randomkeygen.com/
      (-) SERVER_MAIL= This is used by the node mailer package to sign in to the gmail account used to send the emails. You can just leave empty but the server will return an error when it tries to send an email
      (-) SERVER_MAIL_PASSWORD= This is used by the node mailer package to sign in to the gmail account used to send the emails.
      - GOOGLE_DEV_CLIENT_EMAIL= you will need this even in development. as they are associated with your google service account which creates the calendars and manages the events. https://cloud.google.com/iam/docs/service-accounts . You will need to created a project on https://console.cloud.google.com/ and then generate service account credentials by going to => APIs and Services => credentials section
      - GOOGLE_DEV_PRIVATE_KEY= you will need this even in development. as they are associated to your google service account which creates the calendars and manages the events. 
      - CITYLAB= when in development this should have the value 'ALL'
      - CITYLAB_URI= the url of the frontend. locally it will be something like http://localhost:3000
      - CRONJOB= this checks for events that their date has passed and transitions on them to completed. It's a cronjob that runs daily . it accepts values of format '10 * * *'. You can just leave empty. But comment out the code that runs the cronjob.

   - lato client:

      (-) REACT_APP_GOOGLE_CLIENT_ID = again within the project you have created with google you will need to create some additional credentials used for the sso functionality. Probably you will need an OAuth Client id credential. This is used by the following package https://www.npmjs.com/package/react-google-login . If you don't want the sso just remove the component from the LogInScreen component
      - REACT_APP_CITYLAB_LANGUAGES= languages that the citylab will be available in.  e.g 'en el de fr hu it' these are the available ones. choose the ones you want and provide them with a space between
      - REACT_APP_CITYLAB= used to choose the proper faqs ,citylab image etc  for development put 'Development'
      (-) REACT_APP_CITYLAB_TITLE= the title of the website that appears on the tab
      (-) REACT_APP_CITYLAB_URL= this is just a link pointing to an external document
      (-) REACT_APP_TERMS_AND_POLICY= this is just a link pointing to an external document

npm start
```
(con questo si avvia il backend)

per il frontend -> 
   cd client 
   npm start
