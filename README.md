#### Paste your connection string for mongodb inside app.module.ts

    MongooseModule.forRoot(
      'mongodb+srv://yaroslavrodz:rHj14oOORNKfH5NW@cluster0.khhiqlb.mongodb.net/?retryWrites=true&w=majority',
    ),

#### Start server:

    npm run start:dev


#### Database dump file
##### This is a postgresql dump file and requests from requests from postman database collection works with it
##### Download this file. Open pgAdmin. Create a new database, right-click on it, click on 'Restore' and select the downloaded file.

    https://drive.google.com/drive/folders/1I3oaonF8rKZan107Zm-6WwWgKOJExkUG?usp=share_link

#### Postman collection links:
##### There are three links with request collections for database, api, imap synchronizations 
##### Open Postman, click on Import, choose 'Link' and paste the link

    Database:
    There are instructions in the description sections for database collection
    https://api.postman.com/collections/14672581-bc9058aa-cbab-48b2-bd1d-7dfa3bf6342c?access_key=PMAT-01H14J7VZWAD9MYWKBR94ZEHYQ

    Api:
    https://api.postman.com/collections/14672581-8b2152a4-c47f-4042-8256-d163c024eebf?access_key=PMAT-01H14JA6VAQ5XVGPTQ6GGSC5GV

    Imap:
    https://api.postman.com/collections/14672581-c87f6000-608c-48dd-98f3-27f89049fc67?access_key=PMAT-01H14JBA94TW19CH83EHNSV78B

