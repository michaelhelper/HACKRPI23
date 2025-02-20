#~~http://EmergencyRoom.Compare/~~ https://hackrpi-23.vercel.app (Due to google cloud credits running out the current project has limited functionality)
With emergency rooms becoming more and more crowded, long waits are becoming an ever more common occurrence. With our website, you can know in advance when to go further away to be seen faster.
![Demo Gif](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/655/302/datas/original.gif)


## Inspiration
With emergency rooms becoming more and more crowded, long waits are becoming an ever more common occurrence. Statistics have shown the longer patients wait, the worse their outcomes.

When HackRPI announced their patient safety category, we knew what we needed to do. As a team, many of us are part of the medical field, from Wilderness First Aiders and Lifeguards to EMTs (who even left mid-hackathon for a standby response), including one who considered a career as a trauma nurse before coming to RPI. In this field, we strive to help people and protect our patients.

In looking into what we could do to protect our patients, we identified a key risk to patients prolonged ER wait times, and so we set out to find a way around them.
## What it does
In some cases when going to the ER, it may be faster to go to a further away ER to avoid waiting time and be seen faster in net time. Using our tool, we will find you the ERs that will see you the soonest based on a combination of the time to drive to the ER and the estimated ER waiting time.
## How we built it
Our app is built upon a google cloud VM running ubuntu to power a LAMP stack. On the front end we are using Leaflet.js and JQuery along with our own styling to create a visually pleasing, user-friendly UI. Powering our data, we are taking in driving time data from the Google Maps Route/Directions API, and we are getting ER waiting times using an internal REST-ful API that scrapes the web to find waiting times. We are also hosting a second, simple JSON API/Database/Data set on GitHub that powers our directory of hospitals and hospital capabilities. 

We also had an unfinished section that utilized OpenAI (aka chatGPT) to attempt to triage patients to the most appropriate hospital, not just the fastest. This unfortunately did not pan out due to technical issues with the OpenAI API. Other proposed ways to implement this feature included an algorithm based on the assessment algorithm used by EMTs and a more traditional AI/ML model (likely regression based).
## Challenges we ran into
- While building, we realized there were no data sources for a lot of the data we need, so we build our own.
- While developing, our Google Cloud account ran out of credits, inhibiting the development and testing of our app, so we bought more.
- The OpenAI API that we were trying to implement was not able to be successfully implemented, as it was far more intensive than originally planned, and too far out of our scope, so after 15+ developer hours, we decided to scrap this feature in favor of putting adequate resources towards our core competencies. 
## Accomplishments that we're proud of
- For several of us, this was our first ever hackathon
- This project came out very well polished, beyond what we originally thought we could do in the time frame.
- We played with a ton of new technologies and got to use technologies we use all the time in brand new ways.
- Being a brand-new team, we each got to experience the other's style's and thought processes to grow as developers.
## What's next for EmergencyRoom.compare
Just because it didn't make it to the demo doesn't mean we're giving up on it entirely, by the next time you see this site, we will hopefully have a model/algorithm to triage patients and suggest the most appropriate. facility.
Further, we want to expand the area covered by this project, building our datasets for a new region takes some time, but as we have the time, we are working towards letting this app help people all over the country, and maybe even beyond.


Dataset: [Dataset](https://github.com/tfinnm/HospitalData/)


## Contributers
![Contributers](https://badges.pufler.dev/contributors/michaelhelper/HACKRPI23?size=50&padding=5&bots=true)

## Explanations for prize categories:
### Best in Patient Safety Tech
Please See Above, this is intended to be used for patient safety, and is in my opinion, the best.
### Best Use of Google Cloud
Not only was our project hosted on google cloud, but it also depended extensively on APIs provided by google cloud.
### Most Creative Use of GitHub
Not only is this a pretty solid readme, we are actually using another github repo (linked above) to store and host our database/data set for use as an API.
### Best Domain Name from GoDaddy Registry
We've bought [https://EmergencyRoom.Compare/](https://EmergencyRoom.Compare/) from them, which we believe is a pretty good description of our site right in the domain, and we've deployed our project to it so that y'all can go and check it out!
### Best First Time Hack
For most of the members of our group, this is our very first hackathon project, expecially those of us leading the project.
