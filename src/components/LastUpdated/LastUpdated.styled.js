import { CircleNotch } from '@styled-icons/fa-solid';
import styled from 'styled-components';

import rotate from '../../styles/keyframes/rotate';

export const Wrapper = styled.div`
  color: #666;
  text-align: right;
  font-size: 0.7rem;
  margin-top: 1rem;
  padding-right: 0.5rem;
`;

export const Spinner = styled(CircleNotch)`
  width: 0.7rem;
  height: 0.7rem;
  margin-right: 0.2rem;
  animation: ${rotate} 1s infinite linear;
`;
