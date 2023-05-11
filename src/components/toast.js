import React from "react";
import { useToast } from "@chakra-ui/react";

const Toast = ({message,type,duration,isClosable}) => {
  const toast = useToast()

 
    return (
       <div>
            {toast({
              title: message,
              status: type,
              duration: duration,
              isClosable: isClosable,
              position:"top-right"
            })}
        </div>
    )
};
export default Toast;