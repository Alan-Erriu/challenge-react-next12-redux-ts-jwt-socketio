import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getClosedTicketData, setClosedTicket} from '../redux/ticketsSlice';
// import { dataClosedTickets } from '../utils/mockData';
const Container = styled.div`
  display: grid;
  background-color: red;
  border: 1px solid #eee;
  padding: 5px;
  position: fixed;
  top: 25%;
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




const ClosedTicket = () => {
    const dataTickets = useAppSelector(getClosedTicketData);
    //Acá quizás se podría filtrar por ID o alguna otra cosa.
    const dataClosedTickets = dataTickets[0];
    const dispatch = useAppDispatch();
  const ClosModal = () => {
    const payload = "";
    dispatch(setClosedTicket(payload));
    
  };
  return (
    <Container>
      <Content>
        <Row>
          <Title>{dataClosedTickets.title}</Title>
          <CloseButton onClick={ClosModal}>X</CloseButton>
        </Row>
        <Row>
          <div>{dataClosedTickets.description}</div>
        </Row>
        <Row>
          <div>{dataClosedTickets.tag}</div>
          <div>{dataClosedTickets.brand}</div>
        </Row>
        <Row>
          <div>Código: {dataClosedTickets.id}</div>
        </Row>
        <Row>
          <div> {`Fecha: ${dataClosedTickets.date.getDay()}/${dataClosedTickets.date.getMonth()}/${dataClosedTickets.date.getFullYear()}`}</div>
        </Row>
        <Row>
          <div>Prioridad: {dataClosedTickets.priority === 1 ?"Media" :"Alta"}</div>
        </Row>
        <Row>
          <div>Estado: {dataClosedTickets.status === 1 ?"Cerrado":"Abierto"}</div>
        </Row>
      </Content>
    </Container>
  );
};

export default ClosedTicket;