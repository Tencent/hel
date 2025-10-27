import styled, { css } from 'styled-components';

export const Wrap = styled.div`
  overflow: hidden;
  z-index: 199;
  position: fixed;
  background-color: #041528;
  width: 60px;
  height: 100vh;
  padding-top: 10px;
  text-align: center;
  top: 0;
  right: 0;
`;

export const MenuBox = styled.div`
  position: fixed;
  ${(props) =>
    css`
      display: ${props.show ? 'block' : 'none'};
    `};
  right: 60px;
  ${(props) =>
    css`
      top: ${props.top || '60px'};
    `};
  width: 280px;
  padding: 6px 6px;
  min-height: 100px;
  background-color: rgb(4, 21, 40);
  border-left: 3px solid white;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  border-right: 1px solid white;
  color: white;
`;

export const MenuItem = styled.div`
  line-height: 33px;
  height: 33px;
  text-align: left;
  padding-left: 12px;
  margin: 3px 0;
  font-size: 14px;
`;

export const MenuText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const IconWrap = styled.div`
  font-size: 16px;
  margin-bottom: 3px;
`;

export const Avatar = styled.div`
  position: absolute;
  border: 1px solid white;
  width: 36px;
  height: 36px;
  ${(props) =>
    css`
      background-image: url(${props.src});
    `};
  background-size: contain;
  margin-left: 12px;
  border-radius: 18px;
  bottom: 12px;
`;
