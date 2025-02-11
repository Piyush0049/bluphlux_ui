import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: sans-serif;
    background-color: #f9f9f9;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    text-align: left;
  }
`;

export default GlobalStyle;
