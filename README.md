# ButterCMS Voice Search Application

This React.js application was designed to be a clone of the FAQ section of the ButterCMS Knowledge Base. It provides a voice search feature by integrating the Microsoft Azure Cognitive Service through the `microsoft-cognitiveservices-speech-sdk` SDK. 

## Prequisites
- Nodejs installed on your computer
- An Azure account with a Speech Service created

## Local Installation
- Clone the repository to your local machine. 
- Install project dependencies using the `yarn install` or `npm installl` command. 

## Credentials 
To access the Cognitive Service API, the `microsoft-cognitiveservices-speech-sdk` uses a Secret Token from the Cognitive service. It also accesses a ButterCMS API through the ButterCMS token.

Create a .env file, and store the credentials in the following format:

```bash
REACT_APP_SPEECH_SERVICE_KEY=<COGNITIVE_SERVICE_KEY>
REACT_APP_SPEECH_SERVICE_REGION=<COGNITIVE_SERVICE_REGION>
REACT_APP_BUTTERCMS_TOKEN=<BUTTERCMS_TOKEN>
```

## One last thing 🤫

Please star ( ⭐️ ) this repository if you find this application useful. The stars ( 🌟 ) provide encouragement.

Happy Hacking ✌️ 