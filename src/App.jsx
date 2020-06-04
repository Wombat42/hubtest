import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';
import { getPokemon } from './api/pokemon';

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

  const [pokeAPI, setPokeAPI] = React.useState('ready');

  React.useEffect(() => {
    if (pokeAPI === 'ready') {
      log('about to run api');
      setPokeAPI('running');
      log('loading...');
      getPokemon()
        .then((result) => {
          setPokeAPI('done');
          log('got a result');
          if (result.ok) {
            log('returned with good data!');
          } else {
            warning('returned with bad data');
          }
        })
        .catch((err) => {
          setPokeAPI('error');
          error(`Failed to get pokemon ${err}`);
        });
    }
  }, [pokeAPI, error, log, warning]);

  return (
    <>
      <Main>
        <Title>HubSpot Code Test</Title>
        <Description> A short description goes here</Description>
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
