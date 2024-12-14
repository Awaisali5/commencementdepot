import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Sidebar = styled.div`
  width: 20%;
  padding: 20px;
  background-color: #f4f4f4;
`;

export const MainContent = styled.div`
  width: 80%;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
`;

export const ProductCard = styled.div`
  width: 30%;
  margin: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

export const ProductImage = styled.div`
  height: 200px;
  background-color: #ddd;
  margin-bottom: 10px;
`;

export const QuickViewButton = styled.button`
  padding: 10px;
  margin-bottom: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
`;

export const ProductInfo = styled.div`
  padding: 10px;
`;

export const Header = styled.div`
  width: 100%;
  height: 200px;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HeaderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
