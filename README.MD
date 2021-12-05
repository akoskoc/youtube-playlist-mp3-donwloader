## A not user friendly youtube playlist mp3 downloader.

### Why?
There are options for downloading youtube playlists as mp3, but they are kinda shady and you have to provide some sensitive information to these applications.
With this tool all the sensitive information is in you controll with the cost of inconvenient use.

### Prerequisites

* A playlist you wish to download from your own youtube account. (No support for other playlists.)
* [Nodejs](https://nodejs.org)
* [Typescript](https://www.npmjs.com/package/typescript) for compilation.
* A project on [google cloud](console.cloud.google.com/) for authentication.

### To make it work
1. Compile a build.
    1. Clone this project.
    1. Install packages.
    1. Run "npm run compile". (Make sure you have typescript globally installed)
1. Get credentials. (Important: the google account you use for the google cloud project should be different from the account you wish to download from.)
    1. Create a new google cloud project.
    1. Under apis and services click library and add youtube data api v3.
    1. Under apis and services create an oath consent screen.
        1. Fill the necessary fields marked with *.
        1. Select youtube data apiv3 readonly for scopes.
        1. The rest is click-through.
    1. Create a OAuth 2.0 Client ID.
        1. Under apis and services go to credentials and click create credential.
        1. Select OAuth client ID.
        1. Select Application type: Dekstop App.
        1. Download the provided credentials as client_secret.json.
    1. Use the created credentials.
        1. Create a folder named ".credentials" in your build folder.
        1. Copy the client_secret.json to build/.credentials/client_secret.json
1. Run the project with "npm start"
1. Select the settings you are prompted for.
1. Do the authentication process.
    