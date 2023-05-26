import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import FormData from 'form-data';

import { ChatModalProps } from '../../types/chat';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUser } from '../../redux/userSlice';
import { setChatsData } from '../../redux/chatsSlice';
import apiClient from '../../utils/client';

function NewChatModal(chatModalProps: ChatModalProps) {
  const { isOpen, setIsOpen } = chatModalProps;

  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [newChatName, setNewChatName] = useState<any | null>();
  const userData = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const data = new FormData();
  const createChat = async () => {
    data.append('name', newChatName);
    data.append('image', selectedImage);

    const config = {
      headers: {
        Authorization: `Bearer ${userData.authToken}`,
      },
    };
   await apiClient.post("chats", data, config)
    
    const dataUserChats = await apiClient.get('chats', config);
    const chatsFromBack = await dataUserChats.data.chats;
    dispatch(setChatsData(chatsFromBack));
    setIsOpen(false);
    
    /*
        TODO:
        1. Create new chat and
        2. Update chats queue with getChatsData to display it
        3. Close popup with handleClose
    */
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatName(e.target.value);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal className="text-chatter-black" show={isOpen} centered>
      <Modal.Header className="justify-content-center">
        <Modal.Title>Agregar Nuevo Chat</Modal.Title>
      </Modal.Header>

      <Modal.Body className="justify-content-center text-center">
        <input
          type="text"
          placeholder="Ingrese Nombre y Apellido"
          className="form-control mb-3"
          onChange={handleNameChange}
        />
        <input
          type="file"
          placeholder="Subir foto de perfil"
          className="form-control"
          onChange={handleImageChange}
        />
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <button className="btn btn-green bg-chatter-blue text-white px-4" onClick={createChat}>
          Agregar
        </button>
        <button className="btn btn-secondary px-4" onClick={handleClose}>
          Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default NewChatModal;