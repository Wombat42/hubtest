import * as React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from './theme';
import App from './App';

const GlobalStyles = createGlobalStyle`
  @import url('${(props) => props.theme.text.fontSource}');

  body {
    background-color: ${(props) => props.theme.palette.appBackground};
    font-family: ${(props) => props.theme.text.fontFamily};
    font-size: ${(props) => props.theme.text.fontSize};
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
