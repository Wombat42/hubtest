import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';
import moment from 'moment';
import { getCustomers, postCustomerAvailability } from './api/hubapi';

const Main = styled.div`
  width: 60%;
  margin: auto;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.palette.contrastText};
`;

const Description = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  font-style: italic;
  color: ${(props) => props.theme.palette.contrastText};
`;

const EventLog = styled.div`
  font-size: 1rem;
  font-weight: 400;
  background-color: ${(props) => props.theme.palette.background};
  border: 1px solid ${(props) => props.theme.palette.contrastText};
  height: 60vh;
  border-radius: 7px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

const Event = styled.div`
  color: ${(props) => props.theme.palette.primary};
`;

const Warning = styled(Event)`
  color: ${(props) => props.theme.palette.warning};
`;

const Error = styled(Event)`
  color: ${(props) => props.theme.palette.error};
`;

function getKeyGenerator(prefix = 'key_') {
  let counter = 0;
  return () => {
    return `${prefix}${counter++}`;
  };
}
const nextKey = getKeyGenerator('eventLog');

function processCountry(country, attendees) {
  const availabilityDateMap = {};
  attendees.forEach((attendee) => {
    // filter dates: remove dates that are not contigous
    const { email, availableDates } = attendee;

    for (let index = 0; index < availableDates.length; index++) {
      const date = availableDates[index];
      const nextDate = availableDates[index + 1];

      const day = moment(date);
      const nextDay = moment(nextDate);
      if (day.diff(nextDay, 'days') === -1) {
        let possibleAttendees = availabilityDateMap[date];
        if (!possibleAttendees) {
          // eslint-disable-next-line no-multi-assign
          possibleAttendees = availabilityDateMap[date] = [];
        }
        possibleAttendees.push(email);
      }
    }
  });

  const sortedList = Object.entries(availabilityDateMap).sort(
    ([, aAttendees = []], [, bAttendees = []]) => {
      let result = 0;
      if (aAttendees.length > bAttendees.length) {
        result = -1;
      } else if (aAttendees.length > bAttendees.length) {
        result = 1;
      }
      return result;
    },
  );
  const [date, possibleAttendees] = sortedList[0];
  return {
    attendeeCount: possibleAttendees.length,
    attendees: possibleAttendees,
    name: country,
    startDate: date || null,
  };
}

function processCustomerData({ data }) {
  const countryMap = {};
  const { partners } = data;
  partners.forEach((customer) => {
    const { country } = customer;
    let countryArray = countryMap[country];
    if (!countryArray) {
      // eslint-disable-next-line no-multi-assign
      countryMap[country] = countryArray = [];
    }
    countryArray.push(customer);
  });

  const countries = [];
  Object.entries(countryMap).forEach(([country, attendees]) => {
    countries.push(processCountry(country, attendees));
  });

  return {
    countries,
  };
}

function App() {
  const [events, setEvents] = React.useState([]);

  const log = React.useCallback(
    (message, type) => {
      let eventType;
      switch (type) {
        case 'error':
          eventType = Error;
          break;
        case 'warning':
          eventType = Warning;
          break;
        default:
          eventType = Event;
      }
      const event = React.createElement(
        eventType,
        { id: nextKey() },
        message,
      );
      events.push(event);
      setEvents([...events]);
    },
    [events],
  );
  const warning = React.useCallback(
    (message) => log(message, 'warning'),
    [log],
  );
  const error = React.useCallback(
    (message) => log(message, 'error'),
    [log],
  );

  const [customerGETAPI, setCustomerGETAPI] = React.useState('ready');

  React.useEffect(() => {
    if (customerGETAPI === 'ready') {
      log('About to run api');
      setCustomerGETAPI('running');
      log('Loading the data...');
      getCustomers()
        .then((result) => {
          setCustomerGETAPI('done');
          log('API has returned');
          if (result.ok) {
            log('The data is good!');
            log('Starting to process the attendee data.');
            const invitees = processCustomerData(result);
            log('Done processing customer data');
            log('Posting invitation list');
            // Did not add separate state tracking for the post API
            // But should.
            postCustomerAvailability(invitees)
              .then((postResult) => {
                if (postResult.ok) {
                  log('Post accepted!');
                } else {
                  error('Post was not accepted');
                }
              })
              .catch((err) => {
                error('Critical error occurred while posting');
                // eslint-disable-next-line no-console
                console.log(err);
              });
          } else {
            error('Post failed with bad data');
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
          setCustomerGETAPI('error');
          error(`Failed to get API data`);
        });
    }
  }, [customerGETAPI, error, log, warning]);

  return (
    <>
      <Main>
        <Title>HubSpot Code Test</Title>
        <Description>
          This is my take on the HubSpot coding challenge. Below is a
          log of the important events while running the calls to the
          two API.
        </Description>
        <EventLog>
          {events.map((event) => (
            <div key={event.id}>{event}</div>
          ))}
        </EventLog>
      </Main>
    </>
  );
}

export default hot(App);
