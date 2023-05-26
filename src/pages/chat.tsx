import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { IoMdSettings } from 'react-icons/io';
import { HiPhoneMissedCall } from 'react-icons/hi';
import empty from '../assets/images/empty.png';
import MyProfile from '../components/MyProfile';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getUser, setLoginData, setUserData } from '../redux/userSlice';
import { Chat, LogoType } from '../types/chat';
import { getChats, setChatsData, setIsAllowedExpand } from '../redux/chatsSlice';
import ChatHeader from '../components/HomeChat/ChatHeader';
import ConfigDropdown from '../layout/Dropdowns/Config';
import SearchBar from '../components/SearchBar';
import ChatTab from '../components/HomeChat/ChatTab';
import ChatMessages from '../components/HomeChat/ChatMessages';
import io from 'socket.io-client';
import { NotificationWarning } from '../components/Notifications';
import apiClient from '../utils/client';
import OpenenedTicket from '../components/OpenedTicket';
import { getModals, setOpenedTicketData,setClosedTicketData } from '../redux/ticketsSlice';
import ClosedTicket from '../components/ClosedTicket';
import { openTickets,closedTickets } from '../utils/mockData';


function HomeChat() {
  const chatHeaderInitialState: Chat = {
    messages: [],
    messageIdToDisplay: '',
    image: '',
    name: ''
  };
  const [msgEntry, setMsgEntry] = useState<string>('');
  const [selectedChat, setSelectedChat] = useState<string>('');
  const [userChatData, setUserChatData] = useState(chatHeaderInitialState);
  const [configOpen, setConfigOpen] = useState<Boolean>(false);

  const socket = io('http://localhost:8080');

  const ref = useRef<any>();

  const chats = useAppSelector(getChats);

  const modals = useAppSelector(getModals);

  const dispatch = useAppDispatch();

  const userData = useAppSelector(getUser);

  const positionRef = useRef<any>();

  const logo = empty as unknown as LogoType;

  useEffect(() => {
    const fetchData = async () => {
      try {
        //retrieve data from browser cache.
        const tokenLocaStorage = localStorage.getItem('token')!;
        const userIdLocalStorage = localStorage.getItem('userId')!;
        const headers = {
          Authorization: `Bearer ${tokenLocaStorage}`
        };

        const dataUserFromBack = await apiClient.get('users', { headers });
        const dataUserChats = await apiClient.get('chats', { headers });
        const dataUserLocal = { authToken: tokenLocaStorage, userId: userIdLocalStorage };
        const dataUser = {
          name: dataUserFromBack.data.name,
          lastName: dataUserFromBack.data.lastName,
          email: dataUserFromBack.data.email,
          photo: dataUserFromBack.data.image,
          userId: dataUserFromBack.data.userId
        };

        const chatsFromBack = dataUserChats.data.chats;
        //I keep the session logged in using the browser's cache.
        dispatch(setLoginData(dataUserLocal));

        dispatch(setUserData(dataUser));
        dispatch(setChatsData(chatsFromBack));
      } catch (error) {
        console.error(error);
      }
    };
    
    dispatch(setOpenedTicketData(openTickets))
    dispatch(setClosedTicketData(closedTickets))
    fetchData();
    /* 
      TODO: 
      1. Get user data 
      2. Get chats data
    */
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
      setConfigOpen((isOpen) => isOpen && chats.isAllowedExpand);

      // Update scroll position
      positionRef.current.scrollIntoView();

      socket.on('chats', (data) => {
        console.log(data);
        getChatsData();
      
      });
      return () => {
        socket.disconnect();
      };

      /*
        TODO: 
        
          1. Listen the socket
          2. Get chat data
          3. Set the socket off and return void to prevent useless renders
      */
    }
  }, [chats]);

  const handleMsgEntry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsgEntry(e.target.value);
  };

  const handleSendMsg = () => {
    if (msgEntry !== '') {
      setMsgEntry('');

      const requestBody = {
        message: msgEntry
      };
      const token = userData.authToken;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      apiClient.post(`chats/${selectedChat}`, requestBody, config);

      /*
        TODO:
        1. Enviar mensaje
      */
    } else {
      NotificationWarning('Debe ingresar un mensaje');
      /* TODO:
        1. Mostrar notificación de error
      */
    }
  };

  const handleChatClick = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMsg();
  };

  const handleOpenConfig = (e: React.MouseEvent<HTMLDivElement>) => {
    setConfigOpen(!configOpen);
    dispatch(setIsAllowedExpand(true));
    e.stopPropagation();
  };

  const getChatsData = async () => {
    if (!userData.authToken) return;
    try {
      const chats = await apiClient.get('/chats', {
        headers: { Authorization: `Bearer ${userData.authToken}` }
      });

      dispatch(setChatsData(chats.data.chats));
    } catch (error) {
      console.log(error);
    }
    /* TODO: 
      Get all chats data 
    */
  };

  return (
    <div className="main-wrapper-chat d-flex row flex-grow-1 w-85" data-aos="zoom-in">
      {modals.openedTicketIsOpen === 'isOpen' ? <OpenenedTicket /> : null}
       {modals.closedTicket === "isOpen" ? <ClosedTicket/> :null}
      <div className="chat-left-side bg-chats-background d-flex flex-column w-30 p-0">
        <div className="profile-container bg-chatter-green px-3 d-flex justify-content-between align-items-center py-2">
          <MyProfile
            name={userData?.name}
            lastName={userData?.lastName}
            email={userData?.email}
            photo={userData?.photo}
          />
          <div className="position-relative cursor-pointer d-flex">
            <span
              className="iconHover fs-3 align-self-center justify-self-center"
              onClick={handleOpenConfig}
            >
              <IoMdSettings aria-label="Boton de Configuracion" />
            </span>
            <ConfigDropdown isOpen={configOpen} userData={userData} getChatsData={getChatsData} />
          </div>
        </div>

        <SearchBar userId={userData.userId} chatId={selectedChat} />

        <div className="chatsDiv d-flex flex-grow-1 flex-column" ref={ref}>
          <div ref={positionRef} />
          {chats && chats.chats.length > 0 ? (
            chats.chats.map((tab: any, i: any) => (
              <ChatTab
                key={i}
                name={tab.name}
                image={tab.photo}
                chatId={tab.chatId}
                messages={tab.messages}
                userData={userData}
                selectedChat={selectedChat}
                onClick={() => handleChatClick(tab.chatId)}
              />
            ))
          ) : (
            <div className="text-chatter-black opacity-25 fs-smaller text-center h-100 d-flex justify-content-center align-items-center text-no-selection">
              <div>No hay chats disponibles</div>
            </div>
          )}
        </div>
      </div>

      {selectedChat === '' ? (
        <div className="chat-right-side empty-chats w-70 d-flex flex-column justify-content-center align-items-center align-content-center p-0 position-relative text-no-selection overflow-hidden">
          <img className="opacity-50" src={logo.src} alt="background" />
          <div className="d-flex flex-column align-items-center justify-content-center text-chatter-black opacity-75">
            <div className="fs-3 fw-bold">CHATTER</div>
            <div className="my-1">¡Comunicate con tus amigos sin costo alguno!</div>
            <div className="division-line bg-chatter-black opacity-25 my-3"></div>
            <div className="fs-smaller d-flex justify-content-center align-items-center gap-2">
              <HiPhoneMissedCall />
              Llamadas Deshabilitadas
            </div>
          </div>
          <div className="empty-chat-line" />
        </div>
      ) : (
        <div className="chat-right-side w-70 d-flex flex-column p-0">
          <ChatHeader {...userChatData} />

          <ChatMessages chatId={selectedChat} chatsData={chats} setUserChatData={setUserChatData} />

          <div className="d-flex flex-row align-items-center justify-content-center bg-chatter-green px-4 py-2">
            <div className="black-icon cursor-pointer text-chatter-black fs-3 opacity-75">
              <FontAwesomeIcon icon={faSmile} />
            </div>

            <div className="w-100 px-3">
              <input
                placeholder="Escribe tu mensaje"
                value={msgEntry}
                className="user-chat-input px-4 py-4 w-100 bg-white"
                onChange={handleMsgEntry}
                onKeyDown={handleEnterPress}
                disabled={selectedChat ? false : true}
              />
            </div>

            <div
              className="black-icon text-chatter-black fs-3 opacity-75 cursor-pointer"
              onClick={handleSendMsg}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default HomeChat;
