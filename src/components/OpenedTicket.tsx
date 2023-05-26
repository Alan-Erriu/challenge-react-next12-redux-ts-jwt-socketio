import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getOpenedTicketData, setOpenedTicket } from '../redux/ticketsSlice';


const Container = styled.div`
  display: grid;
  background-color: #36dd81;
  border: 1px solid #eee;
  padding: 5px;
  position: fixed;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 50%;
  grid-template-columns: 1fr;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Title = styled.div`
  font-weight: bold;
`;

const CloseButton = styled.button`
  margin-left: auto;
`;



const OpenedTicket = () => {
  const dataTickets = useAppSelector(getOpenedTicketData);
  //Acá quizás se podría filtrar por ID o alguna otra cosa.
  const dataOpenTickets = dataTickets[0];
  const dispatch = useAppDispatch();
  const ClosModal = () => {
    const payload = "";
    dispatch(setOpenedTicket(payload));
    
  };
  return (
    <Container>
    <Content>
      <Row>
        <Title>{dataOpenTickets.title}</Title>
        <CloseButton onClick={ClosModal}>X</CloseButton>
      </Row>
      <Row>
        <div>{dataOpenTickets.description}</div>
      </Row>
      <Row>
        <div>{dataOpenTickets.tag}</div>
        <div>{dataOpenTickets.brand}</div>
      </Row>
      <Row>
        <div>Código: {dataOpenTickets.id}</div>
      </Row>
      <Row>
        <div> {`Fecha: ${dataOpenTickets.date.getDay()}/${dataOpenTickets.date.getMonth()}/${dataOpenTickets.date.getFullYear()}`}</div>
      </Row>
      <Row>
        <div>Prioridad: {dataOpenTickets.priority === 1 ?"Media" :"Alta"}</div>
      </Row>
      <Row>
        <div>Estado: {dataOpenTickets.status === 1 ?"Cerrado":"Abierto"}</div>
      </Row>
    </Content>
  </Container>
  );
};

export default OpenedTicket;









