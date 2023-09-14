import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
// import { useInstantLayoutTransition } from 'framer-motion';
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const toast = useToast();


    const handleClick = () => setShow(!show);


    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Please fill all fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user/login", { email, password }, config);

            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            localStorage.setItem('userInfo', JSON.stringify(data));

            setLoading(false);
            history.push('/chats')
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing="5px" color="black">
            <FormControl id="Email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Enter Your Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button mt="10px"
                colorScheme="blue"
                width="100%"
                style={{ margiTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
            <Button mt="10px"
                variant="solid"
                colorScheme="red"
                width="100%"
                style={{ margiTop: 15 }}
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Guest User
            </Button>
        </VStack>
    )
}

export default Login