import styled, { css } from 'styled-components';
import { ifProp, switchProp, withProp } from 'styled-tools';

import { baseColor } from '../../styles/variables/colors';

export default styled.button`
  outline: none;
  cursor: pointer;
  border: 0;
  height: 1.8rem;
  line-height: 1.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  padding: 0 0.5rem;
  transition: 150ms all ease-in;
  color: ${switchProp('type', {
    primary: 'white',
    secondary: baseColor,
  })};
  background: ${switchProp('type', {
    primary: baseColor,
    secondary: 'transparent',
  })};
  border: ${withProp(
    switchProp('type', {
      primary: 'transparent',
      secondary: baseColor,
    }),
    (color) => `1px solid ${color}`
  )};

  &:hover {
    color: white;
    background: ${switchProp('type', {
      primary: '#138496',
      secondary: baseColor,
    })};
  }

  ${ifProp(
    'hasError',
    css`
      pointer-events: none;
      color: #cca2a6;
      background: #f3bebe;
      border-color: #cca2a6;
    `
  )};

  ${ifProp(
    'isDisabled',
    css`
      pointer-events: none;
      color: #bbbbbb;
      background: #dedede;
      border-color: #bbbbbb;
    `
  )};
`;