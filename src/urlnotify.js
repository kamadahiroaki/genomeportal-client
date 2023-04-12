import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const Urlnotify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div>
      <p>Result page:</p>
      <p>{JSON.stringify(location.state.data)}</p>
      <Button onClick={handleClick} colorScheme="blue">
        TOP
      </Button>
    </div>
  );
};
export default Urlnotify;
