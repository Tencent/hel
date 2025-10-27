import styled, { css } from 'styled-components';

export const Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999999;
`;

export const ModalWrap = styled.div`
  width: 416px;
  height: 170px;
  background-color: white;
`;

export const ModalHead = styled.div`
  height: 52px;
  line-height: 52px;
  text-align: center;
  font-size: 22px;
  font-weight: 400;
  border-bottom: 1px solid #f0f0f0;
`;

export const ModalBody = styled.div`
  padding: 18px;
  border: 1px solid #f0f0f0;
  font-size: 14px;
  color: grey;
`;

export const ModalFoot = styled.div`
  float: right;
  padding: 18px;
`;

export const ModalBtn = styled.button`
  margin: 0 6px;
  width: 80px;
  ${(props) =>
    css`
      border: 1px solid ${props.primary ? '#007acd' : 'lightgrey'};
    `};
  ${(props) =>
    css`
      background-color: ${props.primary ? '#007acd' : 'white'};
    `};
  ${(props) =>
    css`
      color: ${props.primary ? 'white' : 'black'};
    `};
`;
