import React from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {  FaBell  } from 'react-icons/fa';


const Notificaciones = () => {
    return (
        <Box>
            <IconButton
            icon={<FaBell/>}
            >
                
            </IconButton>
        </Box>
    )
}
export default Notificaciones;