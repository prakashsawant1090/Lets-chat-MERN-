import React, { useState } from 'react';
import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, Input, DrawerBody, useToast } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import { Spinner } from '@chakra-ui/spinner';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
// import { useNavigate } from 'react-router-dom';


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();
  // const navigate = useNavigate();

  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: "Failed to search for the result",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/chats', { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" bg='white' w='100%' p='5px 10px 5px 10px' borderWidth='5px'>
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom" >
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize='2xl' fontFamily='Work sans'>
          Let's Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize='2xl' m={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box style={{ display: "flex", flexDirection: "row", paddingBottom: "2px" }}>
              <Input
                style={{ marginRight: "2px" }}
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner marginLeft="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;