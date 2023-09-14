import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/userBadgeItem';

const GroupChatModel = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    // searching for users to add to group 
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
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
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: "Failed to load the search result",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    }

    


    //searched user to adding to group
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User Already Added',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            return;

        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async() => {
          if(!groupChatName || !selectedUsers){
              toast({
                  title: 'Please fill all the fields',
                  status: 'warning',
                  duration: 5000,
                  isClosable: true,
                  position: 'top',
              });
              return;
          }

          try {
              const config = {
                  headers: {
                      Authorization: `Bearer ${user.token}`,

                  },
              };

              const {data} = await axios.post('/api/chats/group', {
                name : groupChatName,
                users : JSON.stringify(selectedUsers.map((u) =>u._id)),
              }, config);

              setChats([data, ...chats]);
              onClose();
              toast({
                  title: 'New Group Chat Created',
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                  position: 'bottom',
              });
            
          } catch (error) {
              toast({
                  title: 'Failed to create Group Chat',
                  description:error.response.data,
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: 'bottom',
              });
          }
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input placeHolder="Chat Name" mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input placeHolder="Add Users eg: John, Guest" mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        <Box w="100%" display ="flex" flexWrap="wrap">
                            {selectedUsers.map(u => (
                                <UserBadgeItem key={user._id} user={u}
                                    handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>

                        {loading ? (
                            // <ChatLoading />
                            <div>Loading...</div>
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default GroupChatModel