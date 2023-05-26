import { useState } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';
import NewChatModal from '../../components/HomeChat/NewChatModal';
import { DropDownProps } from '../../types/chat';
import { useRouter } from 'next/router';
import { NotificationFailure, NotificationSuccess } from '../../components/Notifications';
import apiClient from '../../utils/client';
import { useAppDispatch } from '../../redux/hooks';
import { setLogoutData } from '../../redux/userSlice';

function ConfigDropdown(dropDownProps: DropDownProps) {
  const { getChatsData, userData, isOpen } = dropDownProps;

  const [delDialogIsOpen, setDelDialogIsOpen] = useState(false);
  const [newChatModalIsOpen, setNewChatModalIsOpen] = useState(false);
  const router = useRouter();
  const handleDeleteUser = () => {
    setDelDialogIsOpen(true);
  };

  const handleNewChatModal = () => {
    setNewChatModalIsOpen(true);
  };
  const dispatch = useAppDispatch();
  const handleConfirmDelete = () => {
    const token = userData.authToken;
    const headers = {
      Authorization: `Bearer ${token}`
    };
    apiClient
      .delete('users', { headers })
      .then((response) => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        router.push('/');
        NotificationSuccess('Usuario eliminado exitosamente');
        dispatch(setLogoutData());
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      })
      .catch((error) => {
        console.error('Error al eliminar al usuario:', error.message);
        NotificationFailure("Algo salio mal")
      });
  };

  /* 
      TODO: 
      1. Get current user data 
      2. Delete user 
    */

  return (
    <div className={isOpen ? 'configDropdown scale1' : 'configDropdown'}>
      <ul>
        <li onClick={handleNewChatModal}>
          <div>Nuevo chat</div>
        </li>
        <li onClick={handleDeleteUser}>
          <div>Eliminar cuenta</div>
        </li>
      </ul>

      <NewChatModal
        isOpen={newChatModalIsOpen}
        setIsOpen={setNewChatModalIsOpen}
        userData={userData}
        getChatsData={getChatsData}
      />
      <ConfirmDialog
        title="Eliminar Usuario"
        text="¿Está seguro que desea eliminar la cuenta?"
        isOpen={delDialogIsOpen}
        handleCancel={setDelDialogIsOpen}
        handleOk={handleConfirmDelete}
      />
    </div>
  );
}

export default ConfigDropdown;
