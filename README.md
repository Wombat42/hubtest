# hubtest

Thank you for taking a look at my solution to the HubSpot Coding challenge. I very much appreciate you taking the time to review the code.

The project is a small React app. You do need Nodejs installed.

Please run `npm install` to pull in the various run-time and build environment libraries.

Then run `npm start` and open your borwser to http://localhost:8080/.

_Note: This was only tested on Chrome. I did not include the `fetch` polyfill so it will not run on IE_

## The Styling

The app uses Styled Components for all CSS. The color may not be very popular. It is based on my terminal window's color scheme.

## The code

The majority of the code for this app is in `src/App.jsx` This file contains the logic to display the application container, call out to the API, process the data, and then post it back.

### /src/index.jsx

Responsible for rendering the React application and initializing the theme.

### /src/App.jsx

This file does all the processing of the customer data, as well as displaying the progress.

The file begins with setting up some basic components for rendering the view.

The next major set of functions are `processCountry` and `processPartnerData`.

The `processPartnerData` method creates a Country `hashmap` object that will group all the partner attendees by country. The country object contains an array of attendees.

The code then iterates over each country entry to identify the best date to get the most attendees. The `processCountry` method is called here.

The `processCountry` method looks at each attendee record and extract the availableData collection and their email address. The code then iterates over each of the dates to see if the current data and the next date are adjacent using the third-party Moment JS library.

If the current data and the next date are adjacent, then the date and attendee are attached to a map of all possible available dates for the country called `availabilityDateMap`.

The `availabilityDateMap` is sorted once all the attendees dates have been compared, by the largest attendee array.

Finally, the `processCountry` method transforms the `availabilityDateMap` with the greatest number of attendees into the country object. The country object follows the spec of the project's POST method.

The `useEffect` method, around line 164, performs all the API calls and processes the data.

Finally, lines 209 - 224 are responsilbe for rendering the UI and event data.

### /src/Api/core

Provides core API functionality. All API calls are done with the Fetch API.

### /src/api/hubtest

Provides the two API end-points.

/src/theme
Minimal themeing for the application.
