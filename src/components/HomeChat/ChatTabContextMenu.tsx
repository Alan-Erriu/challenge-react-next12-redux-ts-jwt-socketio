import * as Menu from '@radix-ui/react-context-menu';
import styled from 'styled-components';
import { useAppDispatch } from '../../redux/hooks';
import { setOpenedTicket,setClosedTicket } from "../../redux/ticketsSlice"

const Container = styled.div`
  background-color: #fff;
  border: 1px solid #eee;
  padding: 5px;
`;

const Item = styled(Menu.Item)`
  color: #000;
  padding: 3px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    color: #fff;
    background-color: #36dd81;
  }
}`;

export default function ChatTabContextMenu() {
  const dispatch = useAppDispatch();
  const payload = "isOpen";

  const handleShowOpenTicket = () => {
    dispatch(setClosedTicket(payload));
    // TODO: Show open ticket component.
  };

  const handleShowClosedTicket = () => {
    dispatch(setOpenedTicket(payload));
    // TODO: Show closed ticket component.
  };

  return (
    <Container>
      <Item onClick={handleShowOpenTicket}>Ver ticket abierto</Item>
      <Menu.Separator />
      <Item onClick={handleShowClosedTicket}>Ver ticket cerrado</Item>
    </Container>
  );
}
